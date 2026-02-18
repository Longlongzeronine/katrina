import { useState } from "react";
import { RevealOnScroll } from "../RevealOnScroll";
import emailjs from "emailjs-com";
import ColorBends from "../../ColorBends";
import contactData from './Endpoint/contact.json';

export const Contact = () => {
  const { contact } = contactData;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        import.meta.env.VITE_SERVICE_ID,
        import.meta.env.VITE_TEMPLATE_ID,
        e.target,
        import.meta.env.VITE_PUBLIC_KEY
      )
      .then(() => {
        alert(contact.form.submitButton.successMessage);
        setFormData({ name: "", email: "", company: "", subject: "", message: "" });
      })
      .catch(() => {
        alert(contact.form.submitButton.errorMessage);
      });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const CardWrapper = ({ children }) => (
    <div className="relative rounded-2xl border border-white/20 bg-black/50 backdrop-blur-md shadow-2xl hover:border-white/30 transition-all">
      {children}
    </div>
  );

  const FormField = ({ field, index }) => {
    const isTextarea = field.type === "textarea";
    const commonClasses =
      "peer w-full bg-white/10 text-white rounded-lg sm:rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 border border-white/20 text-xs sm:text-sm outline-none focus:bg-white/15 placeholder-transparent transition";

    return (
      <div className="relative">
        {isTextarea ? (
          <textarea
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            placeholder=" "
            rows={field.rows}
            className={`${commonClasses} resize-none focus:border-[#38bdf8]`}
            style={{ caretColor: "#38bdf8" }}
            required={field.required}
          />
        ) : (
          <input
            type={field.type}
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            placeholder=" "
            className={`${commonClasses} focus:border-[#0ea5e9]`}
            style={{ caretColor: "#0ea5e9" }}
            required={field.required}
          />
        )}
        <label
          className="absolute left-3 sm:left-4 -top-2 sm:-top-2.5 text-[10px] sm:text-xs px-1.5 sm:px-2
            bg-transparent text-[#38bdf8]
            peer-placeholder-shown:text-xs sm:peer-placeholder-shown:text-sm
            peer-placeholder-shown:top-2.5 sm:peer-placeholder-shown:top-3
            peer-placeholder-shown:text-white/50
            peer-focus:-top-2 sm:peer-focus:-top-2.5
            peer-focus:text-[10px] sm:peer-focus:text-xs
            peer-focus:text-[#38bdf8]
            transition-all pointer-events-none"
        >
          {field.placeholder}
        </label>
      </div>
    );
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen flex items-center justify-center py-32 bg-slate-950 px-2 sm:px-4 overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <ColorBends
          colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
          rotation={0}
          speed={0.2}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          parallax={0.5}
          noise={0.1}
          transparent={false}
          autoRotate={5}
        />
      </div>

      <RevealOnScroll>
        <div className="w-full max-w-5xl mx-auto relative z-10">

          {/* Heading */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4 text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {contact.title}{" "}
              <span className="bg-gradient-to-r from-[#0284c7] via-[#38bdf8] to-[#0ea5e9] bg-clip-text text-transparent">
                {contact.titleHighlight}
              </span>
            </h1>
            <div className="h-1 w-20 sm:w-32 mx-auto bg-gradient-to-r from-transparent via-[#38bdf8] to-transparent rounded-full mb-4 sm:mb-6" />
            <p className="text-sm sm:text-lg text-gray-200 max-w-2xl mx-auto px-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              {contact.description}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 items-start">

            {/* Find Us Card */}
            <div className="hidden lg:block">
              <CardWrapper>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0284c7] to-[#38bdf8] flex items-center justify-center shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">Find Us</h3>
                      <p className="text-gray-300 text-xs">Marquez Rd, Pangi, Maco</p>
                    </div>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-white/20 shadow-inner">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!4v1770113435875!6m8!1m7!1s1Qn8PM63SqRgQlLh6zq7Bg!2m2!1d7.4342942184611!2d125.827941143386!3f182.7151432650223!4f-25.0077791441677!5f0.6838268825808721"
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Street View - Marquez Rd, Pangi, Maco, Davao de Oro"
                    />
                  </div>
                </div>
              </CardWrapper>
            </div>

            {/* Send Message Card */}
            <CardWrapper>
              <div className="p-4 sm:p-6 md:p-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] flex items-center justify-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-xl font-bold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                      Send Message
                    </h3>
                    <p className="text-gray-300 text-[10px] sm:text-xs">We'll get back to you soon</p>
                  </div>
                </div>

                <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
                    {contact.form.fields.slice(0, 2).map((field, index) => (
                      <FormField key={index} field={field} index={index} />
                    ))}
                  </div>
                  {contact.form.fields.slice(2).map((field, index) => (
                    <FormField key={index + 2} field={field} index={index + 2} />
                  ))}

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl
                      bg-gradient-to-r from-[#0284c7] via-[#38bdf8] to-[#0ea5e9]
                      px-4 sm:px-6 py-2.5 sm:py-3 text-white font-semibold text-xs sm:text-sm tracking-wide
                      hover:opacity-90 hover:shadow-lg hover:shadow-[#0ea5e9]/30 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                    {contact.form.submitButton.text}
                  </button>
                </form>
              </div>
            </CardWrapper>

          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
};