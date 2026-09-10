import {createDB} from "../db.js";
const db = createDB();

export const errorHandler = async (err ,req ,res , next)=>{
 console.error(err);


 const errorData = {
  message : err.message,
  method : req.method,
  path : req.originalUrl,
  date : new Date().toISOString()
 };
//  لما تحصل مشكلة في أي مكان في الابلكيشن، الكود ده بياخد معلومات الغلطة، بيسجلها في قاعدة البيانات (Database) عشان تقدر ترجعلها وتعرف إيه اللي حصل، وبعد كده بيرد على العميل (Client) برسال مناسبة للغلطة.

// شرح الكود سطر بسطر:
// import {createDB} from "../db.js"; و const db = createDB();
// بيستورد أداة الداتا بيز وبيعمل منها نسخة عشان يقدر يتعامل معاها ويسجل فيها البيانات.

// export const errorHandler = async (err, req, res, next) => {
// دي الـ Middleware نفسها. ولازم تاخد 4 حاجات بالترتيب ده:

// err: الغلطة أو المشكلة اللي حصلت.

// req: البيانات اللي جاية من العميل (الطلب).

// res: الرد اللي هنرجعه للعميل.

// next: وظيفة بنناديها عشان نعدي للـ Middleware اللي بعدها (لو محتاجين).

// console.error(err);
// بيطبع الغلطة في الـ Terminal عشان وانت بتبني الابلكيشن تشوف الغلطة بعينك فوراً.

// تجميع بيانات الخطأ (errorData):
// بيعمل Object يجمع فيه تفاصيل الغلطة:

// message: نص الغلطة.

// method: نوع الطلب (GET, POST, ... إلخ).

// path: اللينك أو الـ Endpoint اللي حصلت فيه المشكلة.

// date: الوقت والتاريخ اللي حصلت فيه المشكلة.

// await db.insert("errors", errorData);
// بيسجل التفاصيل دي جوه جدول اسمه errors في الداتا بيز.

// التعامل مع أخطاء الـ Validation (if(err.name==="ZodError")):
// بيفحص: لو الغلطة جاية من مكتبة الـ Validation (اسمها Zod):

// بيرجع كود 400 Bad Request (معناه البيانات اللي بعتها المستخدم فيها مشكلة).

// بيرد بـ JSON فيه رسالة "Validation Error" وقائمة بالتفاصيل اللي باظت (err.issues).

// أي غلطة تانية غير الـ Zod:
// لو مش غلطة مدخلات من المستخدم (مثلاً الداتا بيز وقعت أو كود فيه مشكلة):

// بيرجع كود 500 Internal Server Error ومعاه رسالة عامة "internal server error".

await db.insert("errors", errorData);


if(err.name==="ZodError"){
  return res.status(400).json({
    message:"Validation Error",
    errors : err.issues
  });
}
 message: err.message || "Internal Server Error"
};
