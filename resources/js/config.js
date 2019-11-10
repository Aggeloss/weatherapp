export const getHeader = function() {
  const tokenData = window.user; //JSON.parse(localSotrage.getItem('authUser'));
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': 'Bearer' + tokenData.name //tokenData.access_token
  };
  return headers;
}
