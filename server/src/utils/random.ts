export const random = (len : number) => {
    const letter = "1234567890qwertyuiopasdfghjklzxcvbnm"
    let ans = ""
    for(let i = 0 ; i < len;i++){
        ans += letter[Math.floor(Math.random()*letter.length)]
    }
    return ans;
}