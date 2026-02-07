import React from "react";

const NewsletterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
  };
  return (
    <section className="max-w-7xl mx-auto px-4 py-10 border border-blue-400 shadow-lg rounded-3xl text-blue-600">
      <div className="text-center">
        <p className="text-2xl text-blue-600 font-medium">
          Subscribe and get 20% Off
        </p>
        <p className="text-color-300 mt-3">
          Subscribe to our newsletter and unlock 20% OFF on your first order. //
          Get early access to new collections, special deals, and eye-care tips
          curated just for you.
        </p>
        <form className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3">
          <input
            type="email"
            placeholder="Enter your mail ID"
            className="sm:flex-1 w-full outline-none"
            required
          />
          <button
            onSubmit={onSubmitHandler}
            type="submit"
            className="bg-gradient-to-b from-[#f7f8f9] to-[#6363f8] shadow-lg text-blue-900 text-xl px-10 py-4 rouded-3xl border"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterBox;
