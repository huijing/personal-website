!function(){document.addEventListener("DOMContentLoaded",function(){for(var e=document.getElementsByClassName("ciu_embed"),t=0;t<e.length;t++){var a=e[t],i=a.getAttribute("data-feature"),n=a.getAttribute("data-periods"),s=a.getAttribute("data-accessible-colours")||"false",r=a.getAttribute("data-image-base")||"none";if(i){var o="https://caniuse.bitsofco.de/embed/index.html",d='<iframe src="'+o+"?feat="+i+"&periods="+n+"&accessible-colours="+s+"&image-base="+r+'" frameborder="0" width="100%" height="400px"></iframe>';a.innerHTML=d}else a.innerHTML="A feature was not included. Go to <a href='https://caniuse.bitsofco.de/#how-to-use'>https://caniuse.bitsofco.de/#how-to-use</a> to generate an embed."}var c=window.addEventListener?"addEventListener":"attachEvent";(0,window[c])("attachEvent"==c?"onmessage":"message",function(t){var a=t.data;if("string"==typeof a&&a.indexOf("ciu_embed")>-1)for(var i=a.split(":")[1],n=a.split(":")[2],s=0;s<e.length;s++){var r=e[s];if(r.getAttribute("data-feature")===i){var o=parseInt(n)+30;r.childNodes[0].height=o+"px";break}}},!1)})}();