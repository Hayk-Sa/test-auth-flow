import React, { useState } from "react";
import { Input, Textarea, Button, Spacer } from "@nextui-org/react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement form submission logic here
    console.log("Form submitted:", formData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Contact Us</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          name="name"
          variant="bordered"
          value={formData.name}
          onChange={handleChange}
          required
          fullWidth
        />
        <Spacer y={1} />
        <Input
          label="Email"
          name="email"
          type="email"
          variant="bordered"
          value={formData.email}
          onChange={handleChange}
          required
          fullWidth
        />
        <Spacer y={1} />
        <Textarea
          label="Message"
          name="message"
          variant="bordered"
          value={formData.message}
          onChange={handleChange}
          required
          fullWidth
          minRows={4}
        />
        <Spacer y={1} />
        <Button type="submit" color="primary" className="text-white font-bold">
          Send
        </Button>
      </form>
    </div>
  );
}
