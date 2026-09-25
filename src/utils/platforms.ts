export interface PlatformInfo {
  name: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  domain: string;
  category: 'ecommerce' | 'food' | 'travel' | 'jewelry' | 'entertainment';
}

export const PLATFORM_REGISTRY: Record<string, PlatformInfo> = {
  amazon: {
    name: 'Amazon',
    badgeBg: 'bg-amber-50 hover:bg-amber-100',
    badgeText: 'text-amber-800',
    borderColor: 'border-amber-200',
    domain: 'amazon.in',
    category: 'ecommerce',
  },
  flipkart: {
    name: 'Flipkart',
    badgeBg: 'bg-blue-50 hover:bg-blue-100',
    badgeText: 'text-blue-700',
    borderColor: 'border-blue-200',
    domain: 'flipkart.com',
    category: 'ecommerce',
  },
  ikea: {
    name: 'IKEA',
    badgeBg: 'bg-yellow-50 hover:bg-yellow-100',
    badgeText: 'text-blue-900 font-bold',
    borderColor: 'border-yellow-300',
    domain: 'ikea.com/in',
    category: 'ecommerce',
  },
  myntra: {
    name: 'Myntra',
    badgeBg: 'bg-pink-50 hover:bg-pink-100',
    badgeText: 'text-pink-700',
    borderColor: 'border-pink-200',
    domain: 'myntra.com',
    category: 'ecommerce',
  },
  ajio: {
    name: 'Ajio',
    badgeBg: 'bg-slate-100 hover:bg-slate-200',
    badgeText: 'text-slate-800',
    borderColor: 'border-slate-300',
    domain: 'ajio.com',
    category: 'ecommerce',
  },
  swiggy: {
    name: 'Swiggy',
    badgeBg: 'bg-orange-50 hover:bg-orange-100',
    badgeText: 'text-orange-700',
    borderColor: 'border-orange-200',
    domain: 'swiggy.com',
    category: 'food',
  },
  zomato: {
    name: 'Zomato',
    badgeBg: 'bg-red-50 hover:bg-red-100',
    badgeText: 'text-red-700',
    borderColor: 'border-red-200',
    domain: 'zomato.com',
    category: 'food',
  },
  bigbasket: {
    name: 'BigBasket',
    badgeBg: 'bg-emerald-50 hover:bg-emerald-100',
    badgeText: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    domain: 'bigbasket.com',
    category: 'food',
  },
  oyorooms: {
    name: 'OYO',
    badgeBg: 'bg-red-50 hover:bg-red-100',
    badgeText: 'text-red-600 font-bold',
    borderColor: 'border-red-200',
    domain: 'oyorooms.com',
    category: 'travel',
  },
  makemytrip: {
    name: 'MakeMyTrip',
    badgeBg: 'bg-sky-50 hover:bg-sky-100',
    badgeText: 'text-sky-800',
    borderColor: 'border-sky-200',
    domain: 'makemytrip.com',
    category: 'travel',
  },
  booking: {
    name: 'Booking.com',
    badgeBg: 'bg-indigo-50 hover:bg-indigo-100',
    badgeText: 'text-indigo-800',
    borderColor: 'border-indigo-200',
    domain: 'booking.com',
    category: 'travel',
  },
  nobroker: {
    name: 'NoBroker',
    badgeBg: 'bg-teal-50 hover:bg-teal-100',
    badgeText: 'text-teal-800',
    borderColor: 'border-teal-200',
    domain: 'nobroker.in',
    category: 'travel',
  },
  bookmyshow: {
    name: 'BookMyShow',
    badgeBg: 'bg-rose-50 hover:bg-rose-100',
    badgeText: 'text-rose-700',
    borderColor: 'border-rose-200',
    domain: 'bookmyshow.com',
    category: 'entertainment',
  },
  bluestone: {
    name: 'BlueStone',
    badgeBg: 'bg-amber-50 hover:bg-amber-100',
    badgeText: 'text-amber-900',
    borderColor: 'border-amber-200',
    domain: 'bluestone.com',
    category: 'jewelry',
  },
  tanishq: {
    name: 'Tanishq',
    badgeBg: 'bg-amber-100 hover:bg-amber-200',
    badgeText: 'text-amber-950 font-semibold',
    borderColor: 'border-amber-300',
    domain: 'tanishq.co.in',
    category: 'jewelry',
  },
  caratlane: {
    name: 'CaratLane',
    badgeBg: 'bg-purple-50 hover:bg-purple-100',
    badgeText: 'text-purple-800',
    borderColor: 'border-purple-200',
    domain: 'caratlane.com',
    category: 'jewelry',
  },
  melorra: {
    name: 'Melorra',
    badgeBg: 'bg-fuchsia-50 hover:bg-fuchsia-100',
    badgeText: 'text-fuchsia-800',
    borderColor: 'border-fuchsia-200',
    domain: 'melorra.com',
    category: 'jewelry',
  },
  meesho: {
    name: 'Meesho',
    badgeBg: 'bg-pink-50 hover:bg-pink-100',
    badgeText: 'text-pink-800',
    borderColor: 'border-pink-200',
    domain: 'meesho.com',
    category: 'ecommerce',
  },
  google: {
    name: 'Google',
    badgeBg: 'bg-slate-50 hover:bg-slate-100',
    badgeText: 'text-slate-700',
    borderColor: 'border-slate-200',
    domain: 'google.com',
    category: 'travel',
  },
};

export function buildShoppingLinks(searchTerm: string, platformList?: string[]): Record<string, string> {
  const encoded = encodeURIComponent(searchTerm);
  const allLinks: Record<string, string> = {
    amazon: `https://www.amazon.in/s?k=${encoded}`,
    flipkart: `https://www.flipkart.com/search?q=${encoded}`,
    ikea: `https://www.ikea.com/in/en/search/?q=${encoded}`,
    myntra: `https://www.myntra.com/search?q=${encoded}`,
    ajio: `https://www.ajio.com/search/?text=${encoded}`,
    swiggy: `https://www.swiggy.com/search?query=${encoded}`,
    zomato: `https://www.zomato.com/search?q=${encoded}`,
    bigbasket: `https://www.bigbasket.com/ps/?q=${encoded}`,
    oyorooms: `https://www.oyorooms.com/search/?location=${encoded}`,
    makemytrip: `https://www.makemytrip.com/hotels/hotel-listing/?searchText=${encoded}`,
    booking: `https://www.booking.com/search.html?ss=${encoded}`,
    nobroker: `https://www.nobroker.in/property/search/searchterm=${encoded}`,
    bookmyshow: `https://in.bookmyshow.com/search?q=${encoded}`,
    bluestone: `https://www.bluestone.com/search.html?query=${encoded}`,
    tanishq: `https://www.tanishq.co.in/search?q=${encoded}`,
    caratlane: `https://www.caratlane.com/search?q=${encoded}`,
    melorra: `https://www.melorra.com/search?q=${encoded}`,
    meesho: `https://www.meesho.com/search?q=${encoded}`,
    google: `https://www.google.com/search?q=${encoded}`,
  };

  if (platformList && platformList.length > 0) {
    const filtered: Record<string, string> = {};
    for (const p of platformList) {
      const key = p.toLowerCase();
      if (allLinks[key]) {
        filtered[key] = allLinks[key];
      }
    }
    return filtered;
  }

  return allLinks;
}
