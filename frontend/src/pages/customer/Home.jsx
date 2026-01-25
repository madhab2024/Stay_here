import { Link } from 'react-router-dom';
import { useProperties } from '../../context/PropertyContext';

const Home = () => {
  const { properties } = useProperties();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Explore Stays</h1>
          <p className="mt-1 text-gray-500">Find the perfect place for your next adventure.</p>
        </div>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties
          .filter(property => property.status === 'Available')
          .map((property) => (
            <Link
              to={`/customer/property/${property.id}`}
              key={property.id}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer block"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-green-700 rounded-full shadow-sm">
                    {property.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {property.name}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {property.location}
                  </p>
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-gray-50 mt-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-gray-900">${property.price}</span>
                    <span className="text-sm text-gray-500">/ night</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Home;
