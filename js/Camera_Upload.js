var pictureSource; // picture source
var destinationType; // sets the format of returned value
// Wait for device API libraries to load
//
var Flag = false;
document.addEventListener("deviceready", onDeviceReady, false);
// device APIs are available
//

function onDeviceReady() {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
}
// Called when a photo is successfully retrieved
//
function getImage() {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(uploadPhoto, function(message) {
  alert('get picture failed');
},{
  quality: 50, 
  destinationType: navigator.camera.DestinationType.FILE_URI,
  sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
}
    );
}
//라이브러리에서 가져오는 함수
function uploadPhoto(imageURI) {              
console.log(imageURI);

var splitpath = imageURI.split("/");
console.log(splitpath.length);
var fileName = splitpath[splitpath.length-1];
    var options = new FileUploadOptions();
    options.fileKey="file";

    options.fileName = localStorage.getItem('Project_Id')+'-'+fileName+'.jpg';
    //console.log(options.fileName);
    options.mimeType="image/jpeg";
    var params = new Object();
    params.value1 = "test";
    params.value2 = "param"; 
    options.params = params;
    options.chunkedMode = false;
    var ft = new FileTransfer();
    ft.upload(imageURI, "http://54.65.71.36:8080/App_Upload_Capture", win, fail, options);
    
}
function onPhotoDataSuccess(imageURI) {
    // Uncomment to view the base64-encoded image data
  console.log(imageURI);
    // Get image handle
    //
    var cameraImage = document.getElementById('aa');
    // Unhide image elements
    //
    cameraImage.style.display = 'block';
    // Show the captured photo
    // The inline CSS rules are used to resize the image
    //
    Flag = true;
    cameraImage.src = imageURI;
}

function capturePhoto() {
    // Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
        quality: 30,
        targetWidth: 600,
        targetHeight: 600,
        destinationType: destinationType.FILE_URI,
        saveToPhotoAlbum: true
    });
}

function onFail(message) {
    //alert('Failed because: ' + message);
}

function upload() {
    var img = document.getElementById('aa');
    console.log(img);
    var imageURI = img.src;
    
    console.log(imageURI);
    
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = localStorage.getItem('Project_Id')+'-'+imageURI.substr(imageURI.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
    var params = new Object();
    options.params = params;
    options.chunkedMode = false;
    console.log(options);
    console.log('여기까진되나?');
    var ft = new FileTransfer();
    console.log(imageURI);
    
    ft.upload(imageURI, "http://54.65.71.36:8080/App_Upload_Capture", win, fail,
          options);
 
}

function win(r) {
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
    alert('성공적으로 사진이 업로드 되었씁니다.');
    location.replace('tab_memo.html');
}

function fail(error) {
    alert("An error has occurred: Code = " + error.code);
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
}