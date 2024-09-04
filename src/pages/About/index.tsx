export default function AboutUs() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">About Us</h1>
      </header>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Our Mission</h2>
        <p className="text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Our Team</h2>
        <ul className="list-disc list-inside text-gray-600">
          <li>John Doe - CEO</li>
          <li>Jane Smith - CTO</li>
          <li>Mike Johnson - Lead Developer</li>
        </ul>
      </section>
    </div>
  );
}
