const _promise = (parmas) => {
    console.log(1)
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(parmas) {
                resolve("해결 완료");
            } else {
                reject(Error("실패!"))
            }
        }, 3000);
    })
}

_promise(true).then((text) => {
    console.log(text);
    return _promise(true)
}).then((text2) => {
    console.log(text2);
})