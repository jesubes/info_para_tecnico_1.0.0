// const { MessageMedia } = require("whatsapp-web.js")
// const { jsonToImage } = require("../utils/toImage.js")
const { client: whatsapp } = require("./qrCodeController.js")


/** Envio del mesaje por cada numero telefonico */
const reportForMsg = async (req, res) =>{

    //sacar el numero de query
    /* Traemos el JSON para sacar el celular del almacen ya filtrado,
        y los demas campos los enviamos a generar una imagen para enviar
        un archivo .jpg al celular
    */

    const { number = number.toString(), name} = req.query
    const jsonData = req.body
    
    // sacon el convertidor de json a imagen
    //mandamos el JSON a convertir en imagen
    // await jsonToImage(jsonData, number)

    // ---- TODO cambiar a jsonTextSend
    //    const {Texto: jsonTextSend, Unidad: unidad, Tecnico: tecnico, Supervisor: supervisor} = jsonData
    const {Texto: jsonTextSend} = jsonData

    //datos de whatsapp
    const prefixNumber = `549${number}`
    
    //TODO --- enviar el TEXTO ESCRITO EN EL EXCEL

    try{              
        const contactId = await whatsapp.getNumberId(prefixNumber)
        let response = null
        if(contactId){

            response = await whatsapp.sendMessage(contactId._serialized, `${jsonTextSend}`)
            new Promise(resolve => setTimeout(resolve, 500))

            console.log('Mensaje enviado -> ', response.fromMe);

            return res.send({messageSent : response.fromMe})
        } else {
            console.log('Numero no registrado en WhatsApp');   
        }

    } catch( error ){
        console.error('Error al enviar mensaje', error)
        res.status(500).send(`Error al Enviar el mensaje al numero: ${number}`)
    }
}


module.exports = {
    reportForMsg
}