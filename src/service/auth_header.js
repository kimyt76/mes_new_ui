export default function authHeader(type){
  let user = JSON.parse(localStorage.getItem('user'));
  let header = {};

  if ( user ){
    if (  type  === 'form' ) {
      header = {
        "Content-Type": "application/x-www-form-urlencoded",
       // "Authorization": "Bearer " + user.accessToken
      }
    }else if (  type  === 'json' ) {
      header = {
        "Content-Type": "application/json",
      }
    }
  }


}
