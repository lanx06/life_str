

function create_data_hud() {
    var obj = {};
    //obj.text=''
    obj.save_data_server="http herku"
    obj.data={}
    var back= document.createElement("div")
    back.style=""
    var name= document.createElement("div")
    var image_div= document.createElement("div")
    var text= document.createElement("div")
    var day= document.createElement("div")
    name.className="title_text"
    day.className="time_text"
    text.className="content_text"
    back.appendChild(name)
    back.appendChild(day)
    back.appendChild(image_div)
    back.appendChild(text)



    obj.htmltag= back
    obj.up_local_data=function(indata)
    {
        obj.data=indata
        //name
        var title= document.createElement("span")
        title.style.fontSize="30px"
        //title.style.marginTop="100px"
        //title.style.border="50px"
        title.innerHTML="&nbsp;&nbsp;&nbsp;"+obj.data["name"]

        name.appendChild(title)

        //daytime
        var day_text=document.createElement("span")
        day_text.innerHTML=obj.data["time"]+"&nbsp;&nbsp;"
        day_text.style.right="50px"

        day.appendChild(day_text)
        //image
        var image= document.createElement("img")
        image.className="image"
        image.src=obj.data["image_url"]
        image_div.appendChild(image)
        //text
        var span= document.createElement("span")
        span.innerHTML="&nbsp;&nbsp;&nbsp;"+obj.data["text"]
        text.appendChild(span)


        back.className="show_div"
        return back

    }
    
    return  obj
}


    


function handleFiles(files) {


    files=files.srcElement.files
    for (var i = 0; i < files.length; i++) {
        const file = files[i];
        const imageType = /image.*/;

        if (!file.type.match(imageType)) {
            continue;
        }

        const img = document.createElement("img");
        
        img.file = file;
        console.log(file)
        img.classList.add("obj");
        
        for (let index = 0; index < preview.children.length; index++) {
            const element = preview.children[index]
            element.remove()

            
        }
        preview.appendChild(img)


        const reader = new FileReader();
        reader.onload = (function(e) {
                img.src = e.target.result ;
                var base64=img.src.substr(22);
                single_file(base64)
            });
        reader.readAsDataURL(file);
    }
}
function create_file_upload_element()
{
    const dropbox = document.createElement("div");
    dropbox.className="upload_zone"
    dropbox.innerHTML="drop some image"
    dropbox.id="dropbox"
    const preview = document.createElement("div");
    preview.id="preview"
    const  input_element=document.createElement("input")
    input_element.type="file"
    input_element.className="display_none"
    input_element.id="fileUploader"
    var obj={}
    obj.element=[dropbox,input_element,preview]
    obj.readfile_callback=null
    obj.files=[]
    obj.image_base64=[]
    
    function handleFileSelect(e) {
        e.stopPropagation();
        e.preventDefault();
        const fileUploader = document.getElementById("fileUploader");
        fileUploader.click();
    }


    // prevent the default method working
    function dragenter(e) {
        var dropbox=document.getElementById("dropbox")
        // add the styling to div
        dropbox.classList.add("upload_zone_enter");
        e.stopPropagation();
        e.preventDefault();
    }

    const dragleave = function(){ 
        var dropbox=document.getElementById("dropbox")
        dropbox.classList.remove("upload_zone_enter");
        
    }

    // prevent the default method working
    function dragover(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    function handleFiles_drop(files) {
        for (var i = 0; i < files.length; i++) {
            const file = files[i];
            const imageType = /image.*/;

            if (!file.type.match(imageType)) {
                continue;
            }

            const img = document.createElement("img");
            img.classList.add("obj");
            img.file = file;
            console.log(file)
            if (i==0 ) {
                for (let index = 0; index < preview.children.length; index++) {
                    const element = preview.children[index]
                    element.remove()
                }
                preview.appendChild(img)
                
            }
            
            //image.toString('base64')

            const reader = new FileReader();
            reader.onload = (function(e) {
                img.src = e.target.result ;
                //console.log(img.src)
                var base64=img.src.substr(22);
                if (i==0)
                {
                    obj.image_base64.unshift(base64)
                }else
                {
                    obj.image_base64.push(base64)

                }
            });

            reader.readAsDataURL(file);
        }
        if (obj.readfile_callback!=null) {
            obj.readfile_callback(files)
        }
    }

    function drop(e) {
        e.stopPropagation();
        e.preventDefault();

        const dt = e.dataTransfer;
        const files = dt.files;

        var dropbox=document.getElementById("dropbox")
        handleFiles_drop(files);
        dropbox.classList.remove("upload_zone_enter");
    }
    //var dropbox=document.getElementById("dropbox")
    //input_element.onchange=
    input_element.addEventListener("change",handleFiles,false);
    input_element.addEventListener("change",()=>console.log(11),false);

    dropbox.addEventListener("click", handleFileSelect, false);
    dropbox.addEventListener("dragenter", dragenter, false);
    dropbox.addEventListener("dragleave", dragleave, false);
    dropbox.addEventListener("dragover", dragover, false);
    dropbox.addEventListener("drop", drop, false);
    return obj
    

}
function send_data_to_server(send_data)
{
    var  url="./add_data"

    
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(send_data)
    });
}
function get_data_form_server(start,number,callback)
{
    var  url="./get_data?"+
    "start="+start+"&"+
    "number="+number
    fetch(url)
    .then(res => {
        return res.json();
    }).then(result => {
        callback(result)
    });
}
function show_data(get_data) {
    for (let index = 0; index < get_data.length; index++) {
        var gg=create_data_hud()
        var element=get_data[index]

        document.getElementsByClassName("content")[0].appendChild(gg.up_local_data(element))  
    }
    
}
function single_file(base64) {
    ele.image_base64.unshift(base64)
    
}
function get_data_send()
{
    var text=input_text.value
    var name=input_name.value
    var image_base64=ele.image_base64[0]
    console.log(text)
    console.log(name)
    var send_data={
        "name":name,
        "text":text,
        "base64":image_base64,
        "time":new Date().getTime()
    }
    send_data_to_server(send_data)
    //up_load_div.remove()
    
}