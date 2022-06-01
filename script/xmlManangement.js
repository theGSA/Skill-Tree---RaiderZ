

function loadXML(path, reqtype, asyncProc)
{
    //will be removed
    var request = new XMLHttpRequest();
    var i = 0;
    //var xmlData;
    if(asyncProc){
        request.onreadystatechange = function(){
            if(this.readyState == 4){
                asyncProc(this);
            }
        }
    }
    else{
        //request.timeout = 4000;
    }
    request.open("GET", path, false);
    request.send();
    return request.responseXML;
}

function fetchLoadXML(path)
{
    return fetch(path);
}