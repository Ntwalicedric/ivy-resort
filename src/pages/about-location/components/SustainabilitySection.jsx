import React from 'react';
import { motion } from 'framer-motion';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const SustainabilitySection = () => {
  const sustainabilityInitiatives = [
    {
      icon: "Leaf",
      title: "Carbon Neutral Operations",
      description: "100% renewable energy from solar panels and hydroelectric power from Lake Kivu",
      impact: "Zero carbon footprint since 2020",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
    },
    {
      icon: "Droplets",
      title: "Water Conservation",
      description: "Advanced filtration systems and rainwater harvesting protect Lake Kivu\'s ecosystem",
      impact: "40% reduction in water usage",
      image: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=2"
    },
    {
      icon: "Recycle",
      title: "Zero Waste Program",
      description: "Comprehensive recycling, composting, and waste reduction initiatives",
      impact: "95% waste diverted from landfills",
      image: "/assets/images/zero waste.jpg"
    },
    {
      icon: "Users",
      title: "Community Partnership",
      description: "Supporting local farmers, artisans, and conservation projects in surrounding villages",
      impact: "200+ local jobs created",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
    }
  ];

  const certifications = [
    {
      name: "Green Key Certification",
      year: "2020",
      description: "International environmental certification for hospitality",
      icon: "Award"
    },
    {
      name: "EarthCheck Silver",
      year: "2021",
      description: "Recognized for sustainable tourism practices",
      icon: "Medal"
    },
    {
      name: "Rwanda Green Hotel",
      year: "2022",
      description: "National recognition for environmental leadership",
      icon: "Star"
    },
    {
      name: "Carbon Trust Standard",
      year: "2023",
      description: "Verified carbon footprint reduction",
      icon: "Shield"
    }
  ];

  const conservationProjects = [
    {
      title: "Lake Kivu Protection Initiative",
      description: "Partnering with local communities to monitor water quality and protect aquatic life",
      participants: "500+ volunteers",
      icon: "Fish"
    },
    {
      title: "Reforestation Program",
      description: "Planting native trees to restore hillside ecosystems and prevent erosion",
      participants: "10,000 trees planted",
      icon: "TreePine"
    },
    {
      title: "Wildlife Corridor Project",
      description: "Creating safe passages for wildlife between Volcanoes National Park and Lake Kivu",
      participants: "50km corridor established",
      icon: "Rabbit"
    }
  ];

  return (
    <section className="py-20 bg-background">
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
            Sustainability & Conservation
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our commitment to environmental stewardship ensures that Rwanda's natural beauty 
            remains pristine for future generations while supporting local communities.
          </p>
        </motion.div>

        {/* Main Initiatives */}
        <div className="space-y-16 mb-20">
          {sustainabilityInitiatives?.map((initiative, index) => (
            <motion.div
              key={initiative?.title}
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
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                    <Icon name={initiative?.icon} size={24} className="text-success" />
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl font-semibold text-primary">
                      {initiative?.title}
                    </h3>
                    <p className="text-success font-medium">{initiative?.impact}</p>
                  </div>
                </div>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {initiative?.description}
                </p>
                
                <div className="bg-success/5 p-4 rounded-lg border-l-4 border-success">
                  <div className="flex items-center space-x-2">
                    <Icon name="TrendingUp" size={16} className="text-success" />
                    <span className="font-medium text-success">Impact Achievement</span>
                  </div>
                  <p className="text-success/80 mt-1">{initiative?.impact}</p>
                </div>
              </div>
              
              <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                <div className="relative overflow-hidden rounded-2xl">
                  <Image
                    src={initiative?.image}
                    alt={initiative?.title}
                    className="w-full h-80 lg:h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-success/20 to-transparent"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="font-heading text-2xl md:text-3xl font-semibold text-primary text-center mb-12">
            Environmental Certifications
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications?.map((cert, index) => (
              <motion.div
                key={cert?.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card p-6 rounded-xl luxury-shadow text-center space-y-4"
              >
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                  <Icon name={cert?.icon} size={24} className="text-success" />
                </div>
                <div>
                  <h4 className="font-heading text-lg font-semibold text-primary mb-1">
                    {cert?.name}
                  </h4>
                  <p className="text-success text-sm font-medium mb-2">
                    Certified {cert?.year}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {cert?.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Conservation Projects */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-success/5 rounded-2xl p-8 md:p-12"
        >
          <h3 className="font-heading text-2xl md:text-3xl font-semibold text-primary text-center mb-12">
            Active Conservation Projects
          </h3>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {conservationProjects?.map((project, index) => (
              <motion.div
                key={project?.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-background p-6 rounded-xl luxury-shadow space-y-4"
              >
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name={project?.icon} size={20} className="text-success" />
                </div>
                <h4 className="font-heading text-lg font-semibold text-primary">
                  {project?.title}
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {project?.description}
                </p>
                <div className="flex items-center space-x-2 text-success">
                  <Icon name="Users" size={16} />
                  <span className="text-sm font-medium">{project?.participants}</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-lg text-primary font-medium mb-4">
              Join Our Conservation Efforts
            </p>
            <p className="text-muted-foreground mb-6">
              Guests can participate in our conservation programs and make a positive impact during their stay.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center space-x-2 bg-background px-4 py-2 rounded-lg">
                <Icon name="Calendar" size={16} className="text-success" />
                <span className="text-sm">Weekly tree planting</span>
              </div>
              <div className="flex items-center space-x-2 bg-background px-4 py-2 rounded-lg">
                <Icon name="Camera" size={16} className="text-success" />
                <span className="text-sm">Wildlife monitoring</span>
              </div>
              <div className="flex items-center space-x-2 bg-background px-4 py-2 rounded-lg">
                <Icon name="BookOpen" size={16} className="text-success" />
                <span className="text-sm">Educational tours</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SustainabilitySection;