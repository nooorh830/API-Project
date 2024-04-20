

setupUI()
  
function loginBtmClicked() {
  let UserName = document.getElementById("recipient-name").value
  let PassWord = document.getElementById("recipient-PassWord").value
  
  let prams = {
    "username" : UserName,
    "password" : PassWord
      }

  axios.post("https://tarmeezacademy.com/api/v1/login",prams)
  .then((response) => {
    // console.log(response.data)
    localStorage.setItem("token", response.data.token)
    localStorage.setItem("user", JSON.stringify(response.data.user) )
    
    
  
    let modle = document.getElementById("exampleModal")
    let modleInstansce = bootstrap.Modal.getInstance(modle)
    modleInstansce.hide()

    showSuccessAlert("Login successfully ","success" )
    setupUI()
  })
  .catch(error =>{
    
    let message = error.response.data.message
    showSuccessAlert(message,"danger " )
  })

}    

function registerBtmClicked() {
  let User = document.getElementById("register-name").value
  let UserName = document.getElementById("register-nameUser").value
  let email = document.getElementById("register-email").value
  let PassWord = document.getElementById("register-PassWord").value
  let personImg = document.getElementById('personImg').files[0];
  
  
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");

  var formdata = new FormData();
  formdata.append("username", UserName);
  formdata.append("password", PassWord);
  formdata.append("name", User);
  formdata.append("email", email);
  formdata.append("image", personImg);


  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow'
  };

  fetch("https://tarmeezacademy.com/api/v1/register", requestOptions)
    .then(response => response.json())
    .then(response => {
      // console.log(response)
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user) )
      
      let modle = document.getElementById("registerMOdle")
      let modleInstansce = bootstrap.Modal.getInstance(modle)
      modleInstansce.hide()

      showSuccessAlert("New User Registerd" , "success" )
      setupUI()
    })
    .catch(error => {
      let message = error.message
    showSuccessAlert(message,"danger " )
    
    });


}    
 
function showSuccessAlert(customMessage , type){
let alertPlaceholder = document.getElementById('success-alert')
let appendAlert = (message, type) => {

  let wrapper = document.createElement('div')
  wrapper.innerHTML = [
  `<div class="alert alert-${type} alert-dismissible" role="alert">`,
  `   <div>${message}</div>`,
  '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
  '</div>'
  ].join('')

  alertPlaceholder.append(wrapper)
  }

  appendAlert(customMessage, type)


  //todo alrt 
//   setTimeout(() => {
//     // let alert = bootstrap.Alert.getOrCreateInstance('#success-alert')
//     // alert.close()

    

//   },2000)
  
}
  
function logout() {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  showSuccessAlert("Logged out successfully","warning" )
  setupUI()
}

function setupUI(){

  let token = localStorage.getItem("token")

  let loginBtm = document.getElementById("login-btn")
  let registerBtm = document.getElementById("register-btn")
  let logoutBtm = document.getElementById("logout-btn")
  // add btm 
  let addBtm =   document.getElementById("addBtm")

  if(token == null) //not logged in 
  {
    logoutBtm.style.display = "none"
    loginBtm.style.display = "inline-block"
    registerBtm.style.display = "inline-block"
  }else{
  //for log in user 
    loginBtm.style.display = "none"
    registerBtm.style.display = "none"
    logoutBtm.style.display = "inline-block"

    document.getElementById("hidUser").style.display= "inline-block"
    if (addBtm != null){

      addBtm.style.display = "flex"
    }

    let user = getCurrentUser()
    document.getElementById("nav-username").innerHTML = user.username

    document.getElementById("nav-img").src = user.profile_image
    
  }
}

function getCurrentUser(){
    let user = null
    let storageUser = localStorage.getItem("user")
    if (storageUser != null){
      user = JSON.parse(storageUser)
    }
    return user
}
 //post request
function editpostbtn(postId){
  let post = JSON.parse(decodeURIComponent(postId))
  // console.log(post)
  // return
  document.getElementById("post-id-input").value = post.id
  document.getElementById("Title").value = post.title
  document.getElementById("textarea").value = post.body
  document.getElementById("addModleLabel").innerHTML = "Edit Post"
  document.getElementById("post-modal-submit-btn").innerHTML = "Update"
  let postModle = new bootstrap.Modal(document.getElementById("addModle"),{})
  postModle.toggle()

}

function deletPostBtnClicked(postId){
  let post = JSON.parse(decodeURIComponent(postId))
  document.getElementById("delet-post-id-input").value = post.id
  let postModle = new bootstrap.Modal(document.getElementById("delet-post-modal"),{})
  postModle.toggle()

}
 
function confirmPostDelet() {
  const postId =  document.getElementById("delet-post-id-input").value
  let token = localStorage.getItem("token");
  let headers = {
    "authorization": `Bearer ${token}`
  }
  
  // alert(postId)
  // return

  axios.delete(`https://tarmeezacademy.com/api/v1/posts/${postId}`,{
    headers:headers
  })
  .then((response) => {
    // console.log(response)
    // return
    
    let modle = document.getElementById("delet-post-modal")
    let modleInstansce = bootstrap.Modal.getInstance(modle)
    modleInstansce.hide()

    showSuccessAlert("The post has been Deleted Successfully ","success" )
    getpost()
  })
  .catch(error =>{
    
    let message = error.response.data.message
    showSuccessAlert(message,"danger " )
  })
}

function addNewPost(){
  let postId = document.getElementById("post-id-input").value
  let isCreate = postId == null || postId == ""

  let title = document.getElementById("Title").value
  let textarea = document.getElementById("textarea").value
  let dataURL = document.getElementById('formFile').files[0];
  let token = localStorage.getItem("token")
 
  let formdata = new FormData();
  formdata.append("image", dataURL);
  formdata.append("body", textarea);
  formdata.append("title", title);
  
  let headers = {
    "authorization": `Bearer ${token}`
  }

  if(isCreate){

    axios.post("https://tarmeezacademy.com/api/v1/posts",formdata, {
      headers: headers
    })
    .then((response) => {
      let modle = document.getElementById("addModle")
      let modleInstansce = bootstrap.Modal.getInstance(modle)
      modleInstansce.hide()
      getpost()
      showSuccessAlert("New Post Has Been Created ","success" )
      
    })
    .catch(error =>{
      
      let message = error.response.data.message 
      showSuccessAlert(message,"danger " )
    })
  }else{
    formdata.append("_method", "put");
    axios.post(`https://tarmeezacademy.com/api/v1/posts/${postId}`,formdata, {
      headers: headers
    })
    .then((response) => {
      let modle = document.getElementById("addModle")
      let modleInstansce = bootstrap.Modal.getInstance(modle)
      modleInstansce.hide()
      getpost()
      showSuccessAlert("The Post Has Been edit ","success" )
      
    })
    .catch(error =>{
      
      let message = error.response.data.message 
      showSuccessAlert(message,"danger " )
    })


  }

}

function pofilePage() {
  const user  = getCurrentUser()
  // alert(user.id)
  // return  
  const userId = user.id
  window.location.replace(`./profile.html?userid=${userId}`);
}

function toggleLoader(show = false){
  if (show){
    document.getElementById("loader").style.visibility = "visible"
  }else{
    document.getElementById("loader").style.visibility = "hidden"
    

  }
}

 
