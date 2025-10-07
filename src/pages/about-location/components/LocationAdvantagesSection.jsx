import React from 'react';
import { motion } from 'framer-motion';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const LocationAdvantagesSection = () => {
  const locationFeatures = [
    {
      icon: "Waves",
      title: "Lake Kivu Shoreline",
      description: "Direct access to Rwanda's largest lake with pristine waters perfect for swimming, kayaking, and sunset cruises",
      image: "/assets/images/Lake_Kivu_Shores.jpg",
      stats: ">0km of private shoreline"
    },
    {
      icon: "Mountain",
      title: "Volcanic Mountain Views",
      description: "Panoramic vistas of the Virunga Mountains and rolling hills that define Rwanda\'s breathtaking landscape",
      image: "/assets/images/volcanic views.jpg",
      stats: "360° mountain panorama"
    },
    {
      icon: "MapPin",
      title: "Strategic Location",
      description: "Perfectly positioned between Gisenyi and Kibuye, offering easy access to Rwanda's top attractions",
      image: "/assets/images/Lake-Kivu-Rwanda.jpg",
      stats: "45min from Kigali Airport"
    }
  ];

  const nearbyAttractions = [
    {
      name: "Volcanoes National Park",
      distance: "2 hours drive",
      description: "Home to mountain gorillas and golden monkeys",
      icon: "Trees"
    },
    {
      name: "Nyungwe Forest",
      distance: "3 hours drive",
      description: "Canopy walks and diverse wildlife",
      icon: "Leaf"
    },
    {
      name: "Gisenyi Hot Springs",
      distance: "30 minutes",
      description: "Natural thermal springs and spa treatments",
      icon: "Droplets"
    },
    {
      name: "Local Coffee Plantations",
      distance: "15 minutes",
      description: "Award-winning Rwandan coffee tours",
      icon: "Coffee"
    },
    {
      name: "Traditional Villages",
      distance: "20 minutes",
      description: "Authentic cultural experiences",
      icon: "Home"
    },
    {
      name: "Kibuye Peninsula",
      distance: "1 hour boat ride",
      description: "Scenic islands and fishing communities",
      icon: "Anchor"
    }
  ];

  const climateData = [
    { month: "Jan", temp: "24°C", rainfall: "Low" },
    { month: "Feb", temp: "25°C", rainfall: "Low" },
    { month: "Mar", temp: "24°C", rainfall: "Medium" },
    { month: "Apr", temp: "23°C", rainfall: "High" },
    { month: "May", temp: "23°C", rainfall: "High" },
    { month: "Jun", temp: "24°C", rainfall: "Low" },
    { month: "Jul", temp: "25°C", rainfall: "Low" },
    { month: "Aug", temp: "26°C", rainfall: "Low" },
    { month: "Sep", temp: "25°C", rainfall: "Medium" },
    { month: "Oct", temp: "24°C", rainfall: "Medium" },
    { month: "Nov", temp: "23°C", rainfall: "High" },
    { month: "Dec", temp: "24°C", rainfall: "Medium" }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-primary mb-6">
            Prime Location Advantages
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Nestled on Lake Kivu's pristine shores with the Virunga Mountains as our backdrop, 
            Ivy Resort offers unparalleled access to Rwanda's natural wonders.
          </p>
        </motion.div>

        {/* Main Location Features */}
        <div className="space-y-20 mb-20">
          {locationFeatures?.map((feature, index) => (
            <motion.div
              key={feature?.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}
            >
              <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                    <Icon name={feature?.icon} size={24} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl font-semibold text-primary">
                      {feature?.title}
                    </h3>
                    <p className="text-accent font-medium">{feature?.stats}</p>
                  </div>
                </div>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {feature?.description}
                </p>
                
                <div className="flex items-center space-x-6 pt-4">
                  <div className="flex items-center space-x-2 text-success">
                    <Icon name="CheckCircle" size={16} />
                    <span className="text-sm font-medium">Premium Access</span>
                  </div>
                  <div className="flex items-center space-x-2 text-success">
                    <Icon name="Clock" size={16} />
                    <span className="text-sm font-medium">24/7 Available</span>
                  </div>
                </div>
              </div>
              
              <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                <div className="relative overflow-hidden rounded-2xl">
                  <Image
                    src={feature?.image}
                    alt={feature?.title}
                    className="w-full h-80 lg:h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Nearby Attractions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="font-heading text-2xl md:text-3xl font-semibold text-primary text-center mb-12">
            Nearby Attractions
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyAttractions?.map((attraction, index) => (
              <motion.div
                key={attraction?.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card p-6 rounded-xl luxury-shadow hover:luxury-shadow-hover smooth-transition"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name={attraction?.icon} size={20} className="text-accent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-heading text-lg font-semibold text-primary mb-1">
                      {attraction?.name}
                    </h4>
                    <p className="text-accent text-sm font-medium mb-2">
                      {attraction?.distance}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {attraction?.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Climate Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-card rounded-2xl p-8 luxury-shadow"
        >
          <h3 className="font-heading text-2xl font-semibold text-primary text-center mb-8">
            Year-Round Perfect Climate
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            {climateData?.map((data, index) => (
              <div key={data?.month} className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="font-medium text-primary">{data?.month}</div>
                <div className="text-lg font-semibold text-accent">{data?.temp}</div>
                <div className="text-xs text-muted-foreground">{data?.rainfall}</div>
              </div>
            ))}
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <Icon name="Sun" size={24} className="text-warning mx-auto" />
              <h4 className="font-medium text-primary">Tropical Highland</h4>
              <p className="text-sm text-muted-foreground">Comfortable temperatures year-round</p>
            </div>
            <div className="space-y-2">
              <Icon name="Cloud" size={24} className="text-accent mx-auto" />
              <h4 className="font-medium text-primary">Two Seasons</h4>
              <p className="text-sm text-muted-foreground">Dry season ideal for outdoor activities</p>
            </div>
            <div className="space-y-2">
              <Icon name="Thermometer" size={24} className="text-success mx-auto" />
              <h4 className="font-medium text-primary">Perfect Range</h4>
              <p className="text-sm text-muted-foreground">23-26°C average temperature</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LocationAdvantagesSection;