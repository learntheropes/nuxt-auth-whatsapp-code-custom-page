export default defineEventHandler(async (event) => {

  const {
    nextAuthSecret,
  } = useRuntimeConfig();

  const targetUrl = event.req.url;
	const securedUrls = '/api/whatsapp/';
  
  if (targetUrl.startsWith(securedUrls)) {

    const authorization = getHeader(event, 'authorization');
    const token = authorization && authorization.split(' ')[1];
  
    if (!authorization) {
      throw createError({
        statusMessage: 'Unauthenticated',
        statusCode: 401,
      });
    };

    if (token !== nextAuthSecret) {

      throw createError({
        statusMessage: 'Unauthorized',
        statusCode: 403,
      });
    }

    return;
  }
});