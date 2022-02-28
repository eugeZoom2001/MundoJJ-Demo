function ModalAbrir(tag,callback){
    $(tag).modal('show');
    callback();
}

function ModalCerrar(tag,callback){
    $(tag).modal('hide');
    callback();
}