const UPSTREAM = "https://new.express.adobe.com/webpage/IikNb8COpQE4D";
const UPSTREAM_HOST = "new.express.adobe.com";

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/" || url.pathname === "") {
      return proxyTo(UPSTREAM, request);
    }

    const upstreamUrl = `https://${UPSTREAM_HOST}${url.pathname}${url.search}`;
    return proxyTo(upstreamUrl, request);
  },
};

async function proxyTo(targetUrl, request) {
  const upstreamRequest = new Request(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: "follow",
  });

  upstreamRequest.headers.set("Host", UPSTREAM_HOST);

  const response = await fetch(upstreamRequest);
  const newResponse = new Response(response.body, response);

  newResponse.headers.delete("X-Frame-Options");
  newResponse.headers.delete("Content-Security-Policy");
  newResponse.headers.delete("Content-Security-Policy-Report-Only");

  return newResponse;
}