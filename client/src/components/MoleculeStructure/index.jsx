"use client";
import React, { Component } from "react";
import _ from "lodash";
import PropTypes from "prop-types";

// Lazy/dynamic initialize RDKit in the browser only. Avoid any import
// specifier pointing at the package so Next/Turbopack won't try to
// include the Node-targeted Emscripten bundle in server-side manifests.
//
// We prefer to initialize from the global initializer that the RDKit
// UMD build exposes when loaded via <script> (initRDKitModule). If it's
// not present we inject a script tag that loads the RDKit UMD bundle
// from the CDN and then call the global initializer.
const initRDKit = (() => {
  let rdkitLoadingPromise;
  return () => {
    if (!rdkitLoadingPromise) {
      rdkitLoadingPromise = (async () => {
        if (typeof window === "undefined") {
          throw new Error("RDKit can only be initialized in the browser");
        }

        const getGlobalInit = () => {
          // The UMD build exposes an initializer named `initRDKitModule`
          // and also sets module.exports for CommonJS. Check common global
          // names that may appear when the script is loaded directly.
          if (typeof window.initRDKitModule === "function") return window.initRDKitModule;
          if (typeof window.initrdkitmodule === "function") return window.initrdkitmodule;
          if (typeof initRDKitModule === "function") return initRDKitModule; // fallback to global var
          return null;
        };

        let initFn = getGlobalInit();
        if (!initFn) {
          // Inject the RDKit UMD script into the page and wait for it to load.
          await new Promise((resolve, reject) => {
            const existing = document.querySelector("script[data-rdkit-cdn]");
            if (existing) {
              // already being loaded by another instance - wait for it
              existing.addEventListener("load", () => resolve());
              existing.addEventListener("error", () => reject(new Error("Failed to load RDKit script")));
              return;
            }
            const script = document.createElement("script");
            script.setAttribute("data-rdkit-cdn", "1");
            script.src = "https://unpkg.com/@rdkit/rdkit/dist/RDKit_minimal.js";
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Failed to load RDKit script"));
            document.head.appendChild(script);
          });

          initFn = getGlobalInit();
          if (!initFn) {
            throw new Error("RDKit initializer not available on window after loading script");
          }
        }

        const RDKit = await initFn();
        return RDKit;
      })();
    }
    return rdkitLoadingPromise;
  };
})();

class MoleculeStructure extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
    svgMode: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
    structure: PropTypes.string.isRequired,
    subStructure: PropTypes.string,
    extraDetails: PropTypes.object,
    drawingDelay: PropTypes.number,
    scores: PropTypes.number,
  };

  static defaultProps = {
    subStructure: "",
    className: "",
    width: 250,
    height: 200,
    svgMode: false,
    extraDetails: {},
    drawingDelay: undefined,
    scores: 0,
  };

  constructor(props) {
    super(props);

    this.MOL_DETAILS = {
      width: this.props.width,
      height: this.props.height,
      bondLineWidth: 1,
      addStereoAnnotation: true,
      ...this.props.extraDetails,
    };

    this.state = {
      svg: undefined,
      rdKitLoaded: false,
      rdKitError: false,
    };
  }

  drawOnce = (() => {
    let wasCalled = false;

    return () => {
      if (!wasCalled) {
        wasCalled = true;
        this.draw();
      }
    };
  })();

  draw() {
    if (this.props.drawingDelay) {
      setTimeout(() => {
        this.drawSVGorCanvas();
      }, this.props.drawingDelay);
    } else {
      this.drawSVGorCanvas();
    }
  }

  drawSVGorCanvas() {
    const mol = this.RDKit.get_mol(this.props.structure || "invalid");
    const qmol = this.RDKit.get_qmol(this.props.subStructure || "invalid");
    const isValidMol = this.isValidMol(mol);

    if (this.props.svgMode && isValidMol) {
      const svg = mol.get_svg_with_highlights(this.getMolDetails(mol, qmol));
      this.setState({ svg });
    } else if (isValidMol) {
      const canvas = document.getElementById(this.props.id);
      mol.draw_to_canvas_with_highlights(canvas, this.getMolDetails(mol, qmol));
    }

    mol?.delete();
    qmol?.delete();
  }

  isValidMol(mol) {
    return !!mol;
  }

  getMolDetails(mol, qmol) {
    if (this.isValidMol(mol) && this.isValidMol(qmol)) {
      const subStructHighlightDetails = JSON.parse(
        mol.get_substruct_matches(qmol),
      );
      const subStructHighlightDetailsMerged = !_.isEmpty(
        subStructHighlightDetails,
      )
        ? subStructHighlightDetails.reduce(
            (acc, { atoms, bonds }) => ({
              atoms: [...acc.atoms, ...atoms],
              bonds: [...acc.bonds, ...bonds],
            }),
            { bonds: [], atoms: [] },
          )
        : subStructHighlightDetails;
      return JSON.stringify({
        ...this.MOL_DETAILS,
        ...(this.props.extraDetails || {}),
        ...subStructHighlightDetailsMerged,
      });
    } else {
      return JSON.stringify({
        ...this.MOL_DETAILS,
        ...(this.props.extraDetails || {}),
      });
    }
  }

  componentDidMount() {
    initRDKit()
      .then((RDKit) => {
        this.RDKit = RDKit;
        this.setState({ rdKitLoaded: true });
        try {
          this.draw();
        } catch (err) {
          console.log(err);
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ rdKitError: true });
      });
  }

  componentDidUpdate(prevProps) {
    if (
      !this.state.rdKitError &&
      this.state.rdKitLoaded &&
      !this.props.svgMode
    ) {
      this.drawOnce();
    }

    if (this.state.rdKitLoaded) {
      const shouldUpdateDrawing =
        prevProps.structure !== this.props.structure ||
        prevProps.svgMode !== this.props.svgMode ||
        prevProps.subStructure !== this.props.subStructure ||
        prevProps.width !== this.props.width ||
        prevProps.height !== this.props.height ||
        !_.isEqual(prevProps.extraDetails, this.props.extraDetails);

      if (shouldUpdateDrawing) {
        this.draw();
      }
    }
  }

  render() {
    console.log("props score number:", this.props.scores);
    if (this.state.rdKitError) {
      return "Error loading renderer.";
    }
    if (!this.state.rdKitLoaded) {
      return "Loading renderer...";
    }

    const mol = this.RDKit.get_mol(this.props.structure || "invalid");
    const isValidMol = this.isValidMol(mol);
    mol?.delete();

    if (!isValidMol) {
      return (
        <span title={`Cannot render structure: ${this.props.structure}`}>
          Render Error.
        </span>
      );
    } else if (this.props.svgMode) {
      return (
        <div
          title={this.props.structure}
          className={"molecule-structure-svg " + (this.props.className || "")}
          style={{ width: this.props.width, height: this.props.height }}
          dangerouslySetInnerHTML={{ __html: this.state.svg }}
        ></div>
      );
    } else {
      return (
        <div
          className={
            "molecule-canvas-container " + (this.props.className || "")
          }
        >
          <canvas
            title={this.props.structure}
            id={this.props.id}
            width={this.props.width}
            height={this.props.height}
          ></canvas>
          {this.props.scores ? (
            <p className="text-red-600 z-50 p-10">
              Score: {this.props.scores.toFixed(2)}
            </p>
          ) : (
            ""
          )}
        </div>
      );
    }
  }
}

export default MoleculeStructure;