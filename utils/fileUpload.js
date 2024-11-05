
import { v2 as cloudinary } from 'cloudinary';

export const fileUploader = async (file)=>{


    try {
        const data =await cloudinary.uploader.upload(file ,{
            folder:"ctmp"
        })

      return { url:data.secure_url , public_id: data.public_id , error:null}  
    } catch (error) {
        return { url:null , public_id:null , error}
    }

}

export const fileDestroy = async( public_id )=>{

  if(public_id){
    try {
       
      const data = await cloudinary.uploader.destroy(public_id)
      // console.log(data);
      return true
  
    } catch (error) {
      console.error(error);
      
      return false
    }

  }
  return false

}

