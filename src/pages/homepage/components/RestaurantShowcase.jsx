import React, { useState } from 'react';
// import { motion } from 'framer-motion';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RestaurantShowcase = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const cuisineTypes = [
    {
      id: 'african',
      name: 'African Cuisine',
      icon: 'Utensils',
      description: 'Authentic Rwandan flavors with traditional spices and cooking methods',
      signature: 'Ubugali with Isombe',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'chinese',
      name: 'Chinese Cuisine',
      icon: 'Coffee',
      description: 'Exquisite Chinese dishes prepared by master chefs with premium ingredients',
      signature: 'Peking Duck with Pancakes',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 'french',
      name: 'French Cuisine',
      icon: 'Wine',
      description: 'Classic French culinary artistry with contemporary presentation',
      signature: 'Coq au Vin with Herbs',
      image: '/assets/images/Coq au Vin with Herbs.jpg'
    },
    {
      id: 'indian',
      name: 'Indian Cuisine',
      icon: 'Flame',
      description: 'Rich aromatic spices and traditional cooking techniques from India',
      signature: 'Butter Chicken Masala',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'italian',
      name: 'Italian Cuisine',
      icon: 'Pizza',
      description: 'Authentic Italian recipes with fresh ingredients and traditional methods',
      signature: 'Truffle Risotto Milanese',
      image: '/assets/images/truffle-risotto-milanese.jpg'
    }
  ];

  const restaurantFeatures = [
    {
      icon: 'Mountain',
      title: 'Panoramic Views',
      description: 'Breathtaking 360° views of Lake Kivu and surrounding mountains'
    },
    {
      icon: 'Star',
      title: 'Award-Winning Chefs',
      description: 'International culinary team with Michelin-starred experience'
    },
    {
      icon: 'Wine',
      title: 'Premium Wine Selection',
      description: 'Curated collection of international and local wines'
    },
    {
      icon: 'Clock',
      title: 'All-Day Dining',
      description: 'From sunrise breakfast to midnight dining experiences'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Eye' },
    { id: 'cuisines', label: 'Cuisines', icon: 'Utensils' }
  ];

  return (
    <section className="py-16 lg:py-24 bg-muted/30 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-secondary/10 px-4 py-2 rounded-full mb-6">
            <Icon name="ChefHat" size={16} className="text-secondary" />
            <span className="text-sm font-medium text-secondary">Rooftop Dining</span>
          </div>
          
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6">
            Culinary Excellence Above the Clouds
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Elevate your dining experience at our rooftop restaurant, where world-class cuisine meets breathtaking panoramic views of Rwanda's stunning landscape.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-card rounded-xl p-2 luxury-shadow max-w-full">
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 px-3 sm:px-6 py-3 rounded-lg font-medium smooth-transition text-sm ${
                    activeTab === tab?.id
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div>
                  <h3 className="font-heading text-2xl lg:text-3xl font-bold text-primary mb-4">
                    A Dining Experience Like No Other
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Our rooftop restaurant combines exceptional cuisine with unparalleled views, creating an unforgettable dining experience. Watch the sunset over Lake Kivu while savoring dishes crafted by our world-class culinary team.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {restaurantFeatures?.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="h-10 w-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name={feature?.icon} size={20} className="text-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary mb-1">{feature?.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature?.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-row items-center gap-2 flex-wrap">
                  <Button
                    variant="default"
                    size="lg"
                    iconName="Calendar"
                    iconPosition="left"
                    className="bg-secondary hover:bg-secondary/90 text-secondary-foreground whitespace-nowrap px-3 py-2 sm:px-5 sm:py-3 text-sm sm:text-base"
                  >
                    Reserve Table
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    iconName="Menu"
                    iconPosition="left"
                    className="border-secondary text-secondary hover:bg-secondary/5 whitespace-nowrap px-3 py-2 sm:px-5 sm:py-3 text-sm sm:text-base"
                  >
                    View Menu
                  </Button>
                </div>
              </div>

              <div className="relative max-w-full overflow-hidden">
                <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden luxury-shadow max-w-full">
                  <Image
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Rooftop Restaurant Panoramic View"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
                </div>
                
                {/* Floating Stats */}
                <div className="absolute -bottom-6 left-0 sm:-left-6 bg-background rounded-xl p-4 luxury-shadow max-w-[calc(100%-1rem)] sm:max-w-none">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-success/10 rounded-lg flex items-center justify-center">
                      <Icon name="Star" size={20} className="text-success" />
                    </div>
                    <div>
                      <div className="font-semibold text-primary">4.9/5 Rating</div>
                      <div className="text-sm text-muted-foreground">500+ Reviews</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cuisines Tab */}
          {activeTab === 'cuisines' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cuisineTypes?.map((cuisine, index) => (
                <div
                  key={cuisine?.id}
                  className="group bg-card rounded-2xl overflow-hidden luxury-shadow hover:luxury-shadow-hover smooth-transition"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={cuisine?.image}
                      alt={cuisine?.name}
                      className="w-full h-full object-cover group-hover:scale-110 smooth-transition-slow"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-background">
                      <div className="flex items-center space-x-2 mb-2">
                        <Icon name={cuisine?.icon} size={20} />
                        <span className="font-semibold">{cuisine?.name}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {cuisine?.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Signature Dish</div>
                        <div className="font-semibold text-primary">{cuisine?.signature}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-accent hover:bg-accent/10"
                      >
                        <Icon name="ArrowRight" size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default RestaurantShowcase;
