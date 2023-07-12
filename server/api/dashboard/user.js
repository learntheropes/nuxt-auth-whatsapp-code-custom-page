export default eventHandler(async (event) => {

   return event.session.user;
});