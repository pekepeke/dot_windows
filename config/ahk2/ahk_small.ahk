#Include "ime_func.ahk"

;変換(vk1Csc079)
sc079::{
  IME_ON("A")
  IME_SetConvMode("A" , 25)
  IME_SetSentenceMode("A" , "8")
return
}

;カタカナひらがなキー(vkF2sc070)
sc070::{
  IME_ON("A")
  IME_SetConvMode("A" , 25)
  IME_SetSentenceMode("A" , "8")
return
}


;無変換(vk1Dsc07B)
sc07B::IME_OFF("A")

