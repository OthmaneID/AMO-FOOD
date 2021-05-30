if(document.readyState =='loading'){
    document.addEventListener('DOMContentLoaded',ready)
}else{
    ready()
}
console.log("Hello Liv js")
function ready(){

var Delete_Liv=document.querySelectorAll('.delete_Liv')

for (var i = 0; i < Delete_Liv.length; i++) {
        Delete_Liv[i].addEventListener('click',delete_lv)
    }



    function delete_lv()
    {
        var delete_conf=confirm('Avez vous sure de supprimer se Compte ?')
        if(delete_conf)
        {
            var  id=this.id;
            console.log('Delete ',id)
                const delete_id={id:id}
                // var xhttp=new XMLHttpRequest();
                // xhttp.open('POST','/delete_Liv',true);
                // console.log(delete_id)
                // xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
                // xhttp.send(JSON.stringify(delete_id))
                
        }
    }
        
}