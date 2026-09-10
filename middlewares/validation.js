
import { Schema } from "zod/v3";

export const validateBody = (Schema)=>{
  return (req,res,next)=>{

    const result = Schema.safeParse(req.body);
// ;: بنقول لـ Zod "افحص الـ req.body على أساس الـ Schema دي".
//  استخدمنا safeParse بدل parse عشان متعملش Crash للبرنامج لو البيانات غلط،
//  وترجع بدالها Object فيه success: true أو false.

    if( !result.success){
      return next (result.error);
//: لو البيانات مش مطابقة للشروط، بنباصي الـ error لـ next().
//  كدة Express بيفهم إن فيه مشكلة وبيرمي الخطأ مباشرة للـ Global Error
    }
    req.body = result.data;
//الـ Validation بيمسح أي داتا زيادة العميل بعتها وملهاش لازمة، وبينظف المدخلات. السطر ده بيبدل الـ 
// req.body القديم بالداتا المتنظفة والجاهزة.
    next();
  };
};

export const validateQuery = (Schema)=>{
  //req.query (البيانات اللي بتيجي في الـ URL بعد علامة الاستفهام
  return (req , res ,next)=>{
    const result = Schema.safeParse(req.query);

    if(!result.sucess){
      return next (result.error);
    }
     req.query = result.data;
      next();
  };
};


export const validateParams= (Schema)=>{
  return(req,res,next)=>{
      const result = Schema.safeParse(req.params);

    if(!result.success){
      return next (result.error);
    }
     req.params = result.data;
      next();
  };
};

