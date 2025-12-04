import Project from "./project";

import React from 'react'

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div>
      <Project id={id} />
    </div>
  );
}

export default Page
