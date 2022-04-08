function createElementFromString(htmlStr)
{
    var element = document.createElement("div");

    element.innerHTML = htmlStr.trim();

    return element.firstChild;
}

function capitalizeFirstLetter(string) {
	if(!string)
		return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatDesc(desc, param){
    
    if(param == null || desc == null)
        return desc;

    var div = param.split(/(?:,| )+/);
    
	for(var i = 0; i < div.length; i++)
        desc = desc.replace(`{${i}}`,div[i]);
        
	return desc;
}

function objlength(obj)
{
    const nobj = obj;

    return Object.keys(nobj).length;
}

function print(str)
{
    console.log(str);
}