import React from 'react'

export default async function WorkDetails({ params }: {
  params: Promise<{ workId: string }>
}) {
  const workId = (await params).workId;

  return (
    <div><h1>Details about work {workId}</h1></div>
  )
}
