import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { xrpService } from '../services/xrpService';
import './SignupPage.css';
import WalletModal from '../components/WalletModal';
import walletService from '../services/walletService';
import AuthModal from '../components/AuthModal/AuthModal';
import purchaseService from '../services/purchaseService';
import NFTPurchaseModal from '../components/NFTPurchaseModal';

const SignupPage = () => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [walletConnected, setWalletConnected] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [purchaseType, setPurchaseType] = useState(null);
  const [showNFTPurchaseModal, setShowNFTPurchaseModal] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);

  useEffect(() => {
    const fetchCities = async () => {
      const citiesData = [
        {
          id: 1,
          name: 'Tokyo, Japan',
          price: '10000 JVC',
          image: 'https://source.unsplash.com/random/800x600/?tokyo',
          currentBid: '9500 JVC',
          timeLeft: '2d 5h',
          description: 'Own a piece of the world\'s largest metropolis',
          revenueLastMonth: '1000 JVC',
          population: '37.4M'
        },
        {
          id: 2,
          name: 'Delhi, India',
          price: '8000 JVC',
          image: 'https://source.unsplash.com/random/800x600/?delhi',
          currentBid: '7500 JVC',
          timeLeft: '3d 2h',
          description: 'Invest in India\'s capital advertising space',
          revenueLastMonth: '800 JVC',
          population: '31M'
        },
        {
          id: 3,
          name: 'Shanghai, China',
          price: '9000 JVC',
          image: 'https://source.unsplash.com/random/800x600/?shanghai',
          currentBid: '8500 JVC',
          timeLeft: '1d 8h',
          description: 'Capture the essence of China\'s financial hub',
          revenueLastMonth: '900 JVC',
          population: '27M'
        },
        {
          id: 4,
          name: 'São Paulo, Brazil',
          price: '7000 JVC',
          image: 'https://source.unsplash.com/random/800x600/?saopaulo',
          currentBid: '6500 JVC',
          timeLeft: '4d 6h',
          description: 'Brazil\'s largest city advertising opportunity',
          revenueLastMonth: '700 JVC',
          population: '22M'
        },
        {
          id: 5,
          name: 'Mexico City, Mexico',
          price: '7000 JVC',
          image: 'https://source.unsplash.com/random/800x600/?mexicocity',
          currentBid: '6500 JVC',
          timeLeft: '2d 12h',
          description: 'Own advertising rights in the heart of Mexico',
          revenueLastMonth: '700 JVC',
          population: '21.7M'
        },
        {
          id: 6,
          name: 'Dhaka, Bangladesh',
          price: '6500 JVC',
          image: 'https://source.unsplash.com/random/800x600/?dhaka',
          currentBid: '6000 JVC',
          timeLeft: '3d 4h',
          description: 'Tap into Bangladesh\'s rapidly growing market',
          revenueLastMonth: '650 JVC',
          population: '21M'
        },
        {
          id: 7,
          name: 'Cairo, Egypt',
          price: '6500 JVC',
          image: 'https://source.unsplash.com/random/800x600/?cairo',
          currentBid: '6000 JVC',
          timeLeft: '2d 8h',
          description: 'Ancient meets modern in Egypt\'s capital',
          revenueLastMonth: '650 JVC',
          population: '20.5M'
        },
        {
          id: 8,
          name: 'Mumbai, India',
          price: '6400 JVC',
          image: 'https://source.unsplash.com/random/800x600/?mumbai',
          currentBid: '5900 JVC',
          timeLeft: '3d 6h',
          description: 'India\'s entertainment and financial powerhouse',
          revenueLastMonth: '640 JVC',
          population: '20.4M'
        },
        {
          id: 9,
          name: 'Beijing, China',
          price: '6300 JVC',
          image: 'https://source.unsplash.com/random/800x600/?beijing',
          currentBid: '5800 JVC',
          timeLeft: '4d 2h',
          description: 'China\'s cultural and political center',
          revenueLastMonth: '630 JVC',
          population: '20M'
        },
        {
          id: 10,
          name: 'Osaka, Japan',
          price: '6200 JVC',
          image: 'https://source.unsplash.com/random/800x600/?osaka',
          currentBid: '5700 JVC',
          timeLeft: '2d 9h',
          description: 'Japan\'s kitchen and commercial hub',
          revenueLastMonth: '620 JVC',
          population: '19.3M'
        },
        {
          id: 11,
          name: 'New York City, USA',
          price: '6100 JVC',
          image: 'https://source.unsplash.com/random/800x600/?newyork',
          currentBid: '5600 JVC',
          timeLeft: '3d 7h',
          description: 'The city that never sleeps - prime advertising space',
          revenueLastMonth: '610 JVC',
          population: '18.8M'
        },
        {
          id: 12,
          name: 'Karachi, Pakistan',
          price: '5900 JVC',
          image: 'https://source.unsplash.com/random/800x600/?karachi',
          currentBid: '5400 JVC',
          timeLeft: '2d 11h',
          description: 'Pakistan\'s largest city and economic center',
          revenueLastMonth: '590 JVC',
          population: '16.1M'
        },
        {
          id: 13,
          name: 'Buenos Aires, Argentina',
          price: '5800 JVC',
          image: 'https://source.unsplash.com/random/800x600/?buenosaires',
          currentBid: '5300 JVC',
          timeLeft: '4d 3h',
          description: 'The Paris of South America',
          revenueLastMonth: '580 JVC',
          population: '15.6M'
        },
        {
          id: 14,
          name: 'Istanbul, Turkey',
          price: '5700 JVC',
          image: 'https://source.unsplash.com/random/800x600/?istanbul',
          currentBid: '5200 JVC',
          timeLeft: '3d 5h',
          description: 'Where East meets West - bridging two continents',
          revenueLastMonth: '570 JVC',
          population: '15.4M'
        },
        {
          id: 15,
          name: 'Kolkata, India',
          price: '5600 JVC',
          image: 'https://source.unsplash.com/random/800x600/?kolkata',
          currentBid: '5100 JVC',
          timeLeft: '2d 8h',
          description: 'India\'s cultural capital',
          revenueLastMonth: '560 JVC',
          population: '14.9M'
        
          },
      {
        id: 16,
        name: 'Chongqing, China',
        price: '5500 JVC',
        image: 'https://source.unsplash.com/random/800x600/?chongqing',
        currentBid: '5000 JVC',
        timeLeft: '3d 9h',
        description: 'Mountain city with vibrant urban culture',
        revenueLastMonth: '550 JVC',
        population: '14.8M'
      },
      {
        id: 17,
        name: 'Lagos, Nigeria',
        price: '5400 JVC',
        image: 'https://source.unsplash.com/random/800x600/?lagos',
        currentBid: '4900 JVC',
        timeLeft: '4d 6h',
        description: 'Africa\'s largest city and economic powerhouse',
        revenueLastMonth: '540 JVC',
        population: '14.3M'
      },
      {
        id: 18,
        name: 'Manila, Philippines',
        price: '5300 JVC',
        image: 'https://source.unsplash.com/random/800x600/?manila',
        currentBid: '4800 JVC',
        timeLeft: '2d 12h',
        description: 'Pearl of the Orient - Gateway to Philippines',
        revenueLastMonth: '530 JVC',
        population: '14.1M'
      },
      {
        id: 19,
        name: 'Rio de Janeiro, Brazil',
        price: '5200 JVC',
        image: 'https://source.unsplash.com/random/800x600/?rio',
        currentBid: '4700 JVC',
        timeLeft: '3d 8h',
        description: 'Cidade Maravilhosa - The Marvelous City',
        revenueLastMonth: '520 JVC',
        population: '13.5M'
      },
      {
        id: 20,
        name: 'Guangzhou, China',
        price: '5100 JVC',
        image: 'https://source.unsplash.com/random/800x600/?guangzhou',
        currentBid: '4600 JVC',
        timeLeft: '4d 5h',
        description: 'South China\'s commercial hub',
        revenueLastMonth: '510 JVC',
                population: '13.3M'
              },
              {
                id: 21,
                name: 'Shenzhen, China',
                price: '5000 JVC',
                image: 'https://source.unsplash.com/random/800x600/?shenzhen',
                currentBid: '4500 JVC',
                timeLeft: '3d 7h',
                description: 'China\'s Silicon Valley and innovation hub',
                revenueLastMonth: '500 JVC',
                population: '12.9M'
              },
              {
                id: 22,
                name: 'Paris, France',
                price: '4900 JVC',
                image: 'https://source.unsplash.com/random/800x600/?paris',
                currentBid: '4400 JVC',
                timeLeft: '2d 9h',
                description: 'City of Light and global fashion capital',
                revenueLastMonth: '490 JVC',
                population: '11.1M'
              },
              {
                id: 23,
                name: 'London, UK',
                price: '4800 JVC',
                image: 'https://source.unsplash.com/random/800x600/?london',
                currentBid: '4300 JVC',
                timeLeft: '4d 3h',
                description: 'Global financial hub and cultural metropolis',
                revenueLastMonth: '480 JVC',
                population: '10.9M'
              },
              {
                id: 24,
                name: 'Lima, Peru',
                price: '4700 JVC',
                image: 'https://source.unsplash.com/random/800x600/?lima',
                currentBid: '4200 JVC',
                timeLeft: '3d 6h',
                description: 'Gastronomic capital of South America',
                revenueLastMonth: '470 JVC',
                population: '10.7M'
              },
              {
                id: 25,
                name: 'Kinshasa, DRC',
                price: '4600 JVC',
                image: 'https://source.unsplash.com/random/800x600/?kinshasa',
                currentBid: '4100 JVC',
                timeLeft: '2d 11h',
                description: 'Heart of Central Africa\'s commerce',
                revenueLastMonth: '460 JVC',
                population: '9.5M'
                        },
                        {
                          id: 26,
                          name: 'Tianjin, China',
                          price: '4500 JVC',
                          image: 'https://source.unsplash.com/random/800x600/?tianjin',
                          currentBid: '4000 JVC',
                          timeLeft: '3d 8h',
                          description: 'Major port city and industrial center',
                          revenueLastMonth: '450 JVC',
                          population: '9.3M'
                        },
                        {
                          id: 27,
                          name: 'Chennai, India',
                          price: '4400 JVC',
                          image: 'https://source.unsplash.com/random/800x600/?chennai',
                          currentBid: '3900 JVC',
                          timeLeft: '4d 5h',
                          description: 'Gateway to South India',
                          revenueLastMonth: '440 JVC',
                          population: '9.1M'
                        },
                        {
                          id: 28,
                          name: 'Chengdu, China',
                          price: '4300 JVC',
                          image: 'https://source.unsplash.com/random/800x600/?chengdu',
                          currentBid: '3800 JVC',
                          timeLeft: '2d 7h',
                          description: 'Home of pandas and Sichuan culture',
                          revenueLastMonth: '430 JVC',
                          population: '9M'
                        },
                        {
                          id: 29,
                          name: 'Jakarta, Indonesia',
                          price: '4300 JVC',
                          image: 'https://source.unsplash.com/random/800x600/?jakarta',
                          currentBid: '3800 JVC',
                          timeLeft: '3d 9h',
                          description: 'Southeast Asia\'s largest metropolis',
                          revenueLastMonth: '430 JVC',
                          population: '9M'
                        },
                        {
                          id: 30,
                          name: 'Lahore, Pakistan',
                          price: '4200 JVC',
                          image: 'https://source.unsplash.com/random/800x600/?lahore',
                          currentBid: '3700 JVC',
                          timeLeft: '4d 6h',
                          description: 'Cultural heart of Pakistan',
                          revenueLastMonth: '420 JVC',
                          population: '8.7M'
                                            },
                                            {
                                              id: 31,
                                              name: 'Bangalore, India',
                                              price: '4100 JVC',
                                              image: 'https://source.unsplash.com/random/800x600/?bangalore',
                                              currentBid: '3600 JVC',
                                              timeLeft: '3d 5h',
                                              description: 'India\'s Silicon Valley and tech hub',
                                              revenueLastMonth: '410 JVC',
                                              population: '8.5M'
                                            },
                                            {
                                              id: 32,
                                              name: 'Bangkok, Thailand',
                                              price: '4000 JVC',
                                              image: 'https://source.unsplash.com/random/800x600/?bangkok',
                                              currentBid: '3500 JVC',
                                              timeLeft: '2d 8h',
                                              description: 'City of Angels and Southeast Asian crossroads',
                                              revenueLastMonth: '400 JVC',
                                              population: '8.3M'
                                            },
                                            {
                                              id: 33,
                                              name: 'Hyderabad, India',
                                              price: '3900 JVC',
                                              image: 'https://source.unsplash.com/random/800x600/?hyderabad',
                                              currentBid: '3400 JVC',
                                              timeLeft: '4d 7h',
                                              description: 'City of Pearls and emerging tech center',
                                              revenueLastMonth: '390 JVC',
                                              population: '8.2M'
                                            },
                                            {
                                              id: 34,
                                              name: 'Wuhan, China',
                                              price: '3800 JVC',
                                              image: 'https://source.unsplash.com/random/800x600/?wuhan',
                                              currentBid: '3300 JVC',
                                              timeLeft: '3d 6h',
                                              description: 'Central China\'s major transportation hub',
                                              revenueLastMonth: '380 JVC',
                                              population: '8M'
                                            },
                                            {
                                              id: 35,
                                              name: 'Ho Chi Minh City, Vietnam',
                                              price: '3700 JVC',
                                              image: 'https://source.unsplash.com/random/800x600/?hochiminhcity',
                                              currentBid: '3200 JVC',
                                              timeLeft: '2d 9h',
                                              description: 'Vietnam\'s largest commercial center',
                                              revenueLastMonth: '370 JVC',
                                              population: '7.9M'
                                            },
  {
    id: 36,
    name: 'Hong Kong, China',
    price: '3600 JVC',
    image: 'https://source.unsplash.com/random/800x600/?hongkong',
    currentBid: '3100 JVC',
    timeLeft: '3d 8h',
    description: 'Global financial center with iconic skyline',
    revenueLastMonth: '360 JVC',
    population: '7.5M'
  },
  {
    id: 37,
    name: 'Ahmedabad, India',
    price: '3500 JVC',
    image: 'https://source.unsplash.com/random/800x600/?ahmedabad',
    currentBid: '3000 JVC',
    timeLeft: '4d 5h',
    description: 'Gujarat\'s commercial powerhouse',
    revenueLastMonth: '350 JVC',
    population: '7.4M'
  },
  {
    id: 38,
    name: 'Kuala Lumpur, Malaysia',
    price: '3400 JVC',
    image: 'https://source.unsplash.com/random/800x600/?kualalumpur',
    currentBid: '2900 JVC',
    timeLeft: '2d 7h',
    description: 'Modern Asian tiger with iconic towers',
    revenueLastMonth: '340 JVC',
    population: '7.2M'
  },
  {
    id: 39,
    name: 'Baghdad, Iraq',
    price: '3300 JVC',
    image: 'https://source.unsplash.com/random/800x600/?baghdad',
    currentBid: '2800 JVC',
    timeLeft: '3d 6h',
    description: 'Historic city of the Middle East',
    revenueLastMonth: '330 JVC',
    population: '7M'
  },
  {
    id: 40,
    name: 'Toronto, Canada',
    price: '3200 JVC',
    image: 'https://source.unsplash.com/random/800x600/?toronto',
    currentBid: '2700 JVC',
    timeLeft: '4d 4h',
    description: 'Canada\'s diverse economic hub',
    revenueLastMonth: '320 JVC',
    population: '6.8M'
  },
  {
    id: 41,
    name: 'Santiago, Chile',
    price: '3100 JVC',
    image: 'https://source.unsplash.com/random/800x600/?santiago',
    currentBid: '2600 JVC',
    timeLeft: '2d 8h',
    description: 'South American business center',
    revenueLastMonth: '310 JVC',
    population: '6.7M'
  },
  {
    id: 42,
    name: 'Riyadh, Saudi Arabia',
    price: '3000 JVC',
    image: 'https://source.unsplash.com/random/800x600/?riyadh',
    currentBid: '2500 JVC',
    timeLeft: '3d 7h',
    description: 'Heart of the Arabian Peninsula',
    revenueLastMonth: '300 JVC',
    population: '6.5M'
  },
  {
    id: 43,
    name: 'Miami, USA',
    price: '2900 JVC',
    image: 'https://source.unsplash.com/random/800x600/?miami',
    currentBid: '2400 JVC',
    timeLeft: '4d 6h',
    description: 'Gateway to the Americas',
    revenueLastMonth: '290 JVC',
    population: '6.4M'
  },
  {
    id: 44,
    name: 'Pune, India',
    price: '2800 JVC',
    image: 'https://source.unsplash.com/random/800x600/?pune',
    currentBid: '2300 JVC',
    timeLeft: '2d 9h',
    description: 'Maharashtra\'s cultural capital',
    revenueLastMonth: '280 JVC',
    population: '6.2M'
  },
  {
    id: 45,
    name: 'Philadelphia, USA',
    price: '2700 JVC',
    image: 'https://source.unsplash.com/random/800x600/?philadelphia',
    currentBid: '2200 JVC',
    timeLeft: '3d 5h',
    description: 'City of Brotherly Love',
    revenueLastMonth: '270 JVC',
    population: '6.1M'
  },
  {
    id: 46,
    name: 'Madrid, Spain',
    price: '2600 JVC',
    image: 'https://source.unsplash.com/random/800x600/?madrid',
    currentBid: '2100 JVC',
    timeLeft: '3d 4h',
    description: 'Spain\'s vibrant capital and cultural center',
    revenueLastMonth: '260 JVC',
    population: '5.9M'
  },
  {
    id: 47,
    name: 'Dallas-Fort Worth, USA',
    price: '2500 JVC',
    image: 'https://source.unsplash.com/random/800x600/?dallas',
    currentBid: '2000 JVC',
    timeLeft: '4d 3h',
    description: 'Texas\' largest metropolitan powerhouse',
    revenueLastMonth: '250 JVC',
    population: '5.8M'
  },
  {
    id: 48,
    name: 'Houston, USA',
    price: '2400 JVC',
    image: 'https://source.unsplash.com/random/800x600/?houston',
    currentBid: '1900 JVC',
    timeLeft: '2d 7h',
    description: 'Space City and energy capital',
    revenueLastMonth: '240 JVC',
    population: '5.7M'
  },
  {
    id: 49,
    name: 'Atlanta, USA',
    price: '2300 JVC',
    image: 'https://source.unsplash.com/random/800x600/?atlanta',
    currentBid: '1800 JVC',
    timeLeft: '3d 6h',
    description: 'Gateway to the American South',
    revenueLastMonth: '230 JVC',
    population: '5.6M'
  },
  {
    id: 50,
    name: 'Melbourne, Australia',
    price: '2200 JVC',
    image: 'https://source.unsplash.com/random/800x600/?melbourne',
    currentBid: '1700 JVC',
    timeLeft: '4d 5h',
    description: 'Australia\'s cultural capital',
    revenueLastMonth: '220 JVC',
    population: '5.5M'
  },
  {
    id: 51,
    name: 'Singapore',
    price: '2100 JVC',
    image: 'https://source.unsplash.com/random/800x600/?singapore',
    currentBid: '1600 JVC',
    timeLeft: '2d 8h',
    description: 'Lion City and global financial hub',
    revenueLastMonth: '210 JVC',
    population: '5.4M'
  },
  {
    id: 52,
    name: 'Sydney, Australia',
    price: '2000 JVC',
    image: 'https://source.unsplash.com/random/800x600/?sydney',
    currentBid: '1500 JVC',
    timeLeft: '3d 7h',
    description: 'Harbor city and Pacific rim leader',
    revenueLastMonth: '200 JVC',
    population: '4.9M'
  },
  {
    id: 53,
    name: 'Berlin, Germany',
    price: '1900 JVC',
    image: 'https://source.unsplash.com/random/800x600/?berlin',
    currentBid: '1400 JVC',
    timeLeft: '4d 6h',
    description: 'Europe\'s creative and tech hub',
    revenueLastMonth: '190 JVC',
    population: '4.8M'
  },
  {
    id: 54,
    name: 'Barcelona, Spain',
    price: '1800 JVC',
    image: 'https://source.unsplash.com/random/800x600/?barcelona',
    currentBid: '1300 JVC',
    timeLeft: '2d 9h',
    description: 'Mediterranean jewel of culture',
    revenueLastMonth: '180 JVC',
    population: '4.7M'
  },
  {
    id: 55,
    name: 'Washington, D.C., USA',
    price: '1700 JVC',
    image: 'https://source.unsplash.com/random/800x600/?washington',
    currentBid: '1200 JVC',
    timeLeft: '3d 5h',
    description: 'Capital of the United States',
    revenueLastMonth: '170 JVC',
    population: '4.6M'
  }, 
  {
    id: 56,
    name: 'Boston, USA',
    price: '1600 JVC',
    image: 'https://source.unsplash.com/random/800x600/?boston',
    currentBid: '1100 JVC',
    timeLeft: '3d 4h',
    description: 'Hub of education and innovation',
    revenueLastMonth: '160 JVC',
    population: '4.5M'
  },
  {
    id: 57,
    name: 'San Francisco, USA',
    price: '1500 JVC',
    image: 'https://source.unsplash.com/random/800x600/?sanfrancisco',
    currentBid: '1000 JVC',
    timeLeft: '4d 3h',
    description: 'Tech capital of the world',
    revenueLastMonth: '150 JVC',
    population: '4.4M'
  },
  {
    id: 58,
    name: 'Montreal, Canada',
    price: '1400 JVC',
    image: 'https://source.unsplash.com/random/800x600/?montreal',
    currentBid: '900 JVC',
    timeLeft: '2d 7h',
    description: 'Cultural heart of French Canada',
    revenueLastMonth: '140 JVC',
    population: '4.3M'
  },
  {
    id: 59,
    name: 'Rome, Italy',
    price: '1300 JVC',
    image: 'https://source.unsplash.com/random/800x600/?rome',
    currentBid: '800 JVC',
    timeLeft: '3d 6h',
    description: 'The Eternal City',
    revenueLastMonth: '130 JVC',
    population: '4.2M'
  },
  {
    id: 60,
    name: 'Milan, Italy',
    price: '1200 JVC',
    image: 'https://source.unsplash.com/random/800x600/?milan',
    currentBid: '700 JVC',
    timeLeft: '4d 5h',
    description: 'Fashion and financial capital of Italy',
    revenueLastMonth: '120 JVC',
    population: '4.1M'
  },
  {
    id: 61,
    name: 'Marseille, France',
    price: '1100 JVC',
    image: 'https://source.unsplash.com/random/800x600/?marseille',
    currentBid: '600 JVC',
    timeLeft: '2d 8h',
    description: 'Historic Mediterranean port city',
    revenueLastMonth: '110 JVC',
    population: '1.6M'
  },
  {
    id: 62,
    name: 'Lille, France',
    price: '1000 JVC',
    image: 'https://source.unsplash.com/random/800x600/?lille',
    currentBid: '500 JVC',
    timeLeft: '3d 7h',
    description: 'Northern French cultural hub',
    revenueLastMonth: '100 JVC',
    population: '1.6M'
  },
  {
    id: 63,
    name: 'Nice, France',
    price: '900 JVC',
    image: 'https://source.unsplash.com/random/800x600/?nice',
    currentBid: '400 JVC',
    timeLeft: '4d 6h',
    description: 'French Riviera\'s crown jewel',
    revenueLastMonth: '90 JVC',
    population: '1.5M'
  },
  {
    id: 64,
    name: 'Kraków, Poland',
    price: '800 JVC',
    image: 'https://source.unsplash.com/random/800x600/?krakow',
    currentBid: '300 JVC',
    timeLeft: '2d 9h',
    description: 'Poland\'s cultural capital',
    revenueLastMonth: '80 JVC',
    population: '1.5M'
  },
  {
    id: 65,
    name: 'Gdańsk, Poland',
    price: '700 JVC',
    image: 'https://source.unsplash.com/random/800x600/?gdansk',
    currentBid: '200 JVC',
    timeLeft: '3d 5h',
    description: 'Historic Baltic port city',
    revenueLastMonth: '70 JVC',
    population: '1.4M'
  },
  {
    id: 66,
    name: 'Łódź, Poland',
    price: '650 JVC',
    image: 'https://source.unsplash.com/random/800x600/?lodz',
    currentBid: '190 JVC',
    timeLeft: '2d 6h',
    description: 'Poland\'s industrial and cultural center',
    revenueLastMonth: '65 JVC',
    population: '1.3M'
},
{
    id: 67,
    name: 'Seville, Spain',
    price: '640 JVC',
    image: 'https://source.unsplash.com/random/800x600/?seville',
    currentBid: '180 JVC',
    timeLeft: '3d 8h',
    description: 'Heart of Andalusian culture',
    revenueLastMonth: '64 JVC',
    population: '1.3M'
},
{
    id: 68,
    name: 'Valencia, Spain',
    price: '630 JVC',
    image: 'https://source.unsplash.com/random/800x600/?valencia',
    currentBid: '170 JVC',
    timeLeft: '4d 7h',
    description: 'City of arts and sciences',
    revenueLastMonth: '63 JVC',
    population: '1.3M'
},
{
    id: 69,
    name: 'Bilbao, Spain',
    price: '620 JVC',
    image: 'https://source.unsplash.com/random/800x600/?bilbao',
    currentBid: '160 JVC',
    timeLeft: '2d 5h',
    description: 'Basque cultural capital',
    revenueLastMonth: '62 JVC',
    population: '1.2M'
},
{
    id: 70,
    name: 'Thessaloniki, Greece',
    price: '610 JVC',
    image: 'https://source.unsplash.com/random/800x600/?thessaloniki',
    currentBid: '150 JVC',
    timeLeft: '3d 9h',
    description: 'Cultural capital of Northern Greece',
    revenueLastMonth: '61 JVC',
    population: '1.2M'
},
{
    id: 71,
    name: 'Palermo, Italy',
    price: '600 JVC',
    image: 'https://source.unsplash.com/random/800x600/?palermo',
    currentBid: '140 JVC',
    timeLeft: '4d 8h',
    description: 'Sicily\'s historic capital',
    revenueLastMonth: '60 JVC',
    population: '1.2M'
},
{
    id: 72,
    name: 'Genoa, Italy',
    price: '590 JVC',
    image: 'https://source.unsplash.com/random/800x600/?genoa',
    currentBid: '130 JVC',
    timeLeft: '2d 7h',
    description: 'Historic maritime republic',
    revenueLastMonth: '59 JVC',
    population: '1.1M'
},
{
    id: 73,
    name: 'Bologna, Italy',
    price: '580 JVC',
    image: 'https://source.unsplash.com/random/800x600/?bologna',
    currentBid: '120 JVC',
    timeLeft: '3d 6h',
    description: 'Italy\'s gastronomic capital',
    revenueLastMonth: '58 JVC',
    population: '1.1M'
},
{
    id: 74,
    name: 'Florence, Italy',
    price: '570 JVC',
    image: 'https://source.unsplash.com/random/800x600/?florence',
    currentBid: '110 JVC',
    timeLeft: '4d 5h',
    description: 'Birthplace of the Renaissance',
    revenueLastMonth: '57 JVC',
    population: '1.1M'
},
{
    id: 75,
    name: 'Medellín, Colombia',
    price: '560 JVC',
    image: 'https://source.unsplash.com/random/800x600/?medellin',
    currentBid: '100 JVC',
    timeLeft: '2d 4h',
    description: 'City of eternal spring',
    revenueLastMonth: '56 JVC',
    population: '1.1M'
},
{
  id: 76,
  name: 'Córdoba, Argentina',
  price: '550 JVC',
  image: 'https://source.unsplash.com/random/800x600/?cordoba',
  currentBid: '90 JVC',
  timeLeft: '3d 3h',
  description: 'Argentina\'s historic university city',
  revenueLastMonth: '55 JVC',
  population: '1.1M'
},
{
  id: 77,
  name: 'Rosario, Argentina',
  price: '540 JVC',
  image: 'https://source.unsplash.com/random/800x600/?rosario',
  currentBid: '80 JVC',
  timeLeft: '4d 4h',
  description: 'Major port and cultural center',
  revenueLastMonth: '54 JVC',
  population: '1.1M'
},
{
  id: 78,
  name: 'Montevideo, Uruguay',
  price: '530 JVC',
  image: 'https://source.unsplash.com/random/800x600/?montevideo',
  currentBid: '70 JVC',
  timeLeft: '2d 3h',
  description: 'Uruguay\'s coastal capital',
  revenueLastMonth: '53 JVC',
  population: '1.1M'
},
{
  id: 79,
  name: 'Quito, Ecuador',
  price: '520 JVC',
  image: 'https://source.unsplash.com/random/800x600/?quito',
  currentBid: '60 JVC',
  timeLeft: '3d 2h',
  description: 'World\'s highest capital city',
  revenueLastMonth: '52 JVC',
  population: '1.1M'
},
{
  id: 80,
  name: 'Santo Domingo, Dominican Republic',
  price: '510 JVC',
  image: 'https://source.unsplash.com/random/800x600/?santodomingo',
  currentBid: '50 JVC',
  timeLeft: '4d 1h',
  description: 'Caribbean\'s oldest European city',
  revenueLastMonth: '51 JVC',
  population: '1.1M'
},
{
  id: 81,
  name: 'Kingston, Jamaica',
  price: '500 JVC',
  image: 'https://source.unsplash.com/random/800x600/?kingston',
  currentBid: '40 JVC',
  timeLeft: '2d 2h',
  description: 'Heart of Caribbean culture',
  revenueLastMonth: '50 JVC',
  population: '1.1M'
},
{
  id: 82,
  name: 'Honolulu, USA',
  price: '490 JVC',
  image: 'https://source.unsplash.com/random/800x600/?honolulu',
  currentBid: '30 JVC',
  timeLeft: '3d 1h',
  description: 'Pacific paradise capital',
  revenueLastMonth: '49 JVC',
  population: '1.1M'
},
{
  id: 83,
  name: 'Las Vegas, USA',
  price: '480 JVC',
  image: 'https://source.unsplash.com/random/800x600/?lasvegas',
  currentBid: '20 JVC',
  timeLeft: '4d 0h',
  description: 'Entertainment capital of the world',
  revenueLastMonth: '48 JVC',
  population: '1.1M'
},
{
  id: 84,
  name: 'Calgary, Canada',
  price: '470 JVC',
  image: 'https://source.unsplash.com/random/800x600/?calgary',
  currentBid: '10 JVC',
  timeLeft: '2d 1h',
  description: 'Gateway to the Canadian Rockies',
  revenueLastMonth: '47 JVC',
  population: '1.1M'
},
{
  id: 85,
  name: 'Edmonton, Canada',
  price: '460 JVC',
  image: 'https://source.unsplash.com/random/800x600/?edmonton',
  currentBid: '5 JVC',
  timeLeft: '3d 0h',
  description: 'Canada\'s Festival City',
  revenueLastMonth: '46 JVC',
  population: '1.1M'
},
{
  id: 86,
  name: 'Ottawa, Canada',
  price: '450 JVC',
  image: 'https://source.unsplash.com/random/800x600/?ottawa',
  currentBid: '4 JVC',
  timeLeft: '2d 8h',
  description: 'Canada\'s capital city',
  revenueLastMonth: '45 JVC',
  population: '1.0M'
},
{
  id: 87,
  name: 'Colombo, Sri Lanka',
  price: '440 JVC',
  image: 'https://source.unsplash.com/random/800x600/?colombo',
  currentBid: '4 JVC',
  timeLeft: '3d 7h',
  description: 'Pearl of the Indian Ocean',
  revenueLastMonth: '44 JVC',
  population: '1.0M'
},
{
  id: 88,
  name: 'Phnom Penh, Cambodia',
  price: '430 JVC',
  image: 'https://source.unsplash.com/random/800x600/?phnompenh',
  currentBid: '3 JVC',
  timeLeft: '4d 6h',
  description: 'Cambodia\'s charming capital',
  revenueLastMonth: '43 JVC',
  population: '1.0M'
},
{
  id: 89,
  name: 'Tbilisi, Georgia',
  price: '420 JVC',
  image: 'https://source.unsplash.com/random/800x600/?tbilisi',
  currentBid: '3 JVC',
  timeLeft: '2d 5h',
  description: 'Where Europe meets Asia',
  revenueLastMonth: '42 JVC',
  population: '1.0M'
},
{
  id: 90,
  name: 'Skopje, North Macedonia',
  price: '410 JVC',
  image: 'https://source.unsplash.com/random/800x600/?skopje',
  currentBid: '2 JVC',
  timeLeft: '3d 4h',
  description: 'City of statues and history',
  revenueLastMonth: '41 JVC',
  population: '1.0M'
},
{
  id: 91,
  name: 'Sarajevo, Bosnia & Herzegovina',
  price: '400 JVC',
  image: 'https://source.unsplash.com/random/800x600/?sarajevo',
  currentBid: '2 JVC',
  timeLeft: '4d 3h',
  description: 'Jerusalem of Europe',
  revenueLastMonth: '40 JVC',
  population: '1.0M'
},
{
  id: 92,
  name: 'Tirana, Albania',
  price: '390 JVC',
  image: 'https://source.unsplash.com/random/800x600/?tirana',
  currentBid: '1 JVC',
  timeLeft: '2d 2h',
  description: 'Albania\'s colorful capital',
  revenueLastMonth: '39 JVC',
  population: '1.0M'
},
{
  id: 93,
  name: 'Chisinau, Moldova',
  price: '380 JVC',
  image: 'https://source.unsplash.com/random/800x600/?chisinau',
  currentBid: '1 JVC',
  timeLeft: '3d 1h',
  description: 'City of white stone',
  revenueLastMonth: '38 JVC',
  population: '1.0M'
},
{
  id: 94,
  name: 'Reykjavik, Iceland',
  price: '370 JVC',
  image: 'https://source.unsplash.com/random/800x600/?reykjavik',
  currentBid: '1 JVC',
  timeLeft: '4d 0h',
  description: 'Land of fire and ice',
  revenueLastMonth: '37 JVC',
  population: '1.0M'
},
{
  id: 95,
  name: 'Asunción, Paraguay',
  price: '360 JVC',
  image: 'https://source.unsplash.com/random/800x600/?asuncion',
  currentBid: '1 JVC',
  timeLeft: '2d 0h',
  description: 'Mother of Cities',
  revenueLastMonth: '36 JVC',
  population: '1.0M'
},
{
  id: 96,
  name: 'Windhoek, Namibia',
  price: '350 JVC',
  image: 'https://source.unsplash.com/random/800x600/?windhoek',
  currentBid: '1 JVC',
  timeLeft: '3d 0h',
  description: 'Gateway to the Namib Desert',
  revenueLastMonth: '35 JVC',
  population: '1.0M'
},
{
  id: 97,
  name: 'Nouakchott, Mauritania',
  price: '340 JVC',
  image: 'https://source.unsplash.com/random/800x600/?nouakchott',
  currentBid: '1 JVC',
  timeLeft: '4d 0h',
  description: 'Pearl of the Sahara',
  revenueLastMonth: '34 JVC',
  population: '1.0M'
},
{
  id: 98,
  name: 'Port-au-Prince, Haiti',
  price: '330 JVC',
  image: 'https://source.unsplash.com/random/800x600/?portauprince',
  currentBid: '1 JVC',
  timeLeft: '2d 0h',
  description: 'Caribbean cultural hub',
  revenueLastMonth: '33 JVC',
  population: '1.0M'
},
{
  id: 99,
  name: 'Bujumbura, Burundi',
  price: '320 JVC',
  image: 'https://source.unsplash.com/random/800x600/?bujumbura',
  currentBid: '1 JVC',
  timeLeft: '3d 0h',
  description: 'Heart of East Africa',
  revenueLastMonth: '32 JVC',
  population: '1.0M'
},
{
  id: 100,
  name: 'Djibouti City, Djibouti',
  price: '310 JVC',
  image: 'https://source.unsplash.com/random/800x600/?djibouti',
  currentBid: '1 JVC',
  timeLeft: '4d 0h',
  description: 'Pearl of the Gulf of Aden',
  revenueLastMonth: '31 JVC',
  population: '1.0M'
}
      ];

      setCities(citiesData);
      setLoading(false);
    };

    fetchCities();
  }, []);

  const handleConnectWallet = async () => {
    try {
      const address = await walletService.connect();
      setWalletAddress(address);
      setWalletConnected(true);
      setShowWalletModal(false);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleNFTPurchase = (city) => {
    setSelectedNFT(city);
    setShowNFTPurchaseModal(true);
  };

  const handlePurchaseClick = (type) => {
    setPurchaseType(type);
    setShowAuthModal(true);
  };

  const handlePurchaseComplete = (paymentMethod) => {
    console.log(`Processing purchase with ${paymentMethod}`);
    setShowNFTPurchaseModal(false);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="main-container">
      {/* Fixed Header */}
      <header className="header">
        <div className="logo">
          <span className="logo-text">Joint Vibe</span>
        </div>
        <div className="nav-buttons">
          <Link to="/login" className="login-button nav-button">Login</Link>
          <Link to="/registration-choice" className="signup-button nav-button">Sign Up</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="signup-page">
        <div className="cyber-grid"></div>
        <div className="floating-orbs"></div>
        <div className="hero">
          <div className="hero-content">
            <h1 className="hero-title">Joint Vibe</h1>
            <p className="hero-description">
              Experience the pulse of your city's nightlife. Connect with vibrant souls,
              discover electrifying venues, and create memories that last a lifetime.
            </p>
            <div className="cta-buttons">
              <a href="#marketplace" className="cta-primary">Start Your Vibe</a>
              <a href="#features" className="cta-secondary">Explore Features</a>
            </div>
          </div>
        </div>
      </section>

      {/* NFT Marketplace Section */}
      <section className="nft-marketplace-container" id="marketplace">
        <div className="marketplace-header">
          <div className="header-content">
            <h1>City NFT Marketplace</h1>
            <p>Own the Future of Urban Advertising</p>
          </div>
        </div>

        <div className="marketplace-grid">
          {cities.map(city => (
            <div key={city.id} className="nft-card">
              <div className="nft-image-container">
                <img src={city.image} alt={city.name} />
                <div className="time-left">{city.timeLeft}</div>
              </div>
              <div className="nft-info">
                <h3>{city.name}</h3>
                <div className="population-info">
                  <span>Population</span>
                  <h4>{city.population}</h4>
                </div>
                <div className="price-info">
                  <div className="current-price">
                    <span>Price</span>
                    <h4>{city.price}</h4>
                  </div>
                  <div className="current-bid">
                    <span>Current Bid</span>
                    <h4>{city.currentBid}</h4>
                  </div>
                </div>
                <div className="revenue-info">
                  <span>Revenue Last Month</span>
                  <h4>{city.revenueLastMonth}</h4>
                </div>
                <p className="description">{city.description}</p>
                <button 
                  className="purchase-btn"
                  onClick={() => handleNFTPurchase(city)}
                >
                  Purchase NFT
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modals */}
      {showWalletModal && (
        <WalletModal 
          onConnect={handleConnectWallet}
          onClose={() => setShowWalletModal(false)}
        />
      )}
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          onAuth={async (username, password) => {
            try {
              const auth = await api.post('/api/auth/login', { username, password });
              if (auth.data.success) {
                if (purchaseType === 'nft') {
                  await purchaseService.purchaseNFT(auth.data.userId);
                } else {
                  await purchaseService.purchaseJVCoin(auth.data.userId);
                }
                setShowAuthModal(false);
              }
            } catch (error) {
              console.error('Authentication failed:', error);
            }
          }}
        />
      )}
      {showNFTPurchaseModal && (
        <NFTPurchaseModal
          onClose={() => setShowNFTPurchaseModal(false)}
          onPurchase={handlePurchaseComplete}
          cityData={selectedNFT}
        />
      )}
    </div>
  );
};

export default SignupPage;