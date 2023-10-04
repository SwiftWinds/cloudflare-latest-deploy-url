import { getProject } from "./service";

export async function handleRequest(event: FetchEvent): Promise<Response> {
  const { searchParams } = new URL(event.request.url);
  const projectName = searchParams.get("projectName");
  if (!projectName) {
    return new Response("No project defined.", { status: 400 });
  }

  try {
    const project = await getProject(event, projectName);
    if (!project) {
      return new Response("Project not found.", { status: 400 });
    }

    const id = project?.canonical_deployment?.id;
    if (!id) {
      console.error({
        message: "Failed to resolve deployment id",
        response: project,
      });
      return new Response("Failed to resolve deployment id.", { status: 400 });
    }

    return Response.redirect(
      `https://dash.cloudflare.com/?to=/:account/pages/view/${projectName}/${id}`,
      302,
    );
  } catch (error) {
    console.log((error as Error).toString());
    return new Response("Failed to resolve project.", { status: 400 });
  }
}
