import React from 'react';
import { motion } from 'framer-motion';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const ResortStorySection = () => {
  const founderStory = {
    name: "Dr. Amara Uwimana",
    title: "Founder & Visionary",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    quote: `"After years of traveling the world, I realized Rwanda's Lake Kivu region possessed an untapped magic. Ivy Resort was born from my vision to create a sanctuary where international luxury meets authentic Rwandan warmth, where every guest becomes part of our extended family."`
  };

  const milestones = [
    {
      year: "2016",
      title: "Vision Conceived",
      description: "Dr. Uwimana identified the perfect lakeside location"
    },
    {
      year: "2017",
      title: "Construction Begins",
      description: "Sustainable building practices implemented from day one"
    },
    {
      year: "2018",
      title: "Grand Opening",
      description: "Ivy Resort welcomes its first international guests"
    },
    {
      year: "2020",
      title: "Eco-Certification",
      description: "Achieved Green Key environmental certification"
    },
    {
      year: "2023",
      title: "Excellence Award",
      description: "Named 'Best Luxury Resort in Rwanda' by Travel + Leisure"
    }
  ];

  const philosophyPoints = [
    {
      icon: "Heart",
      title: "Authentic Hospitality",
      description: "Every interaction reflects genuine Rwandan warmth and care"
    },
    {
      icon: "Leaf",
      title: "Environmental Stewardship",
      description: "Protecting Lake Kivu\'s pristine ecosystem for future generations"
    },
    {
      icon: "Users",
      title: "Community Partnership",
      description: "Supporting local artisans, farmers, and cultural preservation"
    },
    {
      icon: "Star",
      title: "Uncompromising Quality",
      description: "International luxury standards with authentic local touches"
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
            Our Story
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Born from a vision to showcase Rwanda's natural beauty through world-class hospitality, 
            Ivy Resort represents the perfect harmony between luxury and authenticity.
          </p>
        </motion.div>

        {/* Founder Story */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="bg-card rounded-2xl p-8 md:p-12 luxury-shadow">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src={founderStory?.image}
                      alt={founderStory?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-primary">
                      {founderStory?.name}
                    </h3>
                    <p className="text-muted-foreground">{founderStory?.title}</p>
                  </div>
                </div>
                
                <blockquote className="text-lg text-foreground leading-relaxed italic">
                  "{founderStory?.quote}"
                </blockquote>
                
                <div className="flex items-center space-x-2 text-accent">
                  <Icon name="Quote" size={20} />
                  <span className="font-medium">Founder's Vision</span>
                </div>
              </div>
              
              <div className="relative">
                <Image
                  src="/assets/images/Lake-Kivu-Rwanda.jpg"
                  alt="Ivy Resort founding vision"
                  className="w-full h-80 object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="font-heading text-2xl md:text-3xl font-semibold text-primary text-center mb-12">
            Our Journey
          </h3>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-accent/30 hidden md:block"></div>
            
            <div className="space-y-12">
              {milestones?.map((milestone, index) => (
                <motion.div
                  key={milestone?.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                    <div className="bg-card p-6 rounded-xl luxury-shadow">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                          <span className="text-accent-foreground font-bold text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <h4 className="font-heading text-lg font-semibold text-primary">
                          {milestone?.title}
                        </h4>
                      </div>
                      <p className="text-muted-foreground">{milestone?.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="hidden md:block w-4 h-4 bg-accent rounded-full border-4 border-background relative z-10"></div>
                  
                  <div className="flex-1"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="font-heading text-2xl md:text-3xl font-semibold text-primary text-center mb-12">
            Our Philosophy
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {philosophyPoints?.map((point, index) => (
              <motion.div
                key={point?.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <Icon name={point?.icon} size={24} className="text-accent" />
                </div>
                <h4 className="font-heading text-lg font-semibold text-primary">
                  {point?.title}
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {point?.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ResortStorySection;