export const guardarLocalStorage = (key, dato) => {
   localStorage.setItem(key, JSON.stringify(dato));
   return {
        dataGuardada: {
            key: key,
            dato: dato,
        }
   }
}   

export const extraerLocalStorage = (key) => {
    const data = JSON.parse(localStorage.getItem(key));
    return data;
}   


export const eliminarLocalStorage = (key) => {
    localStorage.removeItem(key);
    return key;
}