import {StatusBar, Dimensions} from 'react-native';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import {AppColors} from './color';
import {PortfolioItem} from '../types/types';

export const screenHeight = Dimensions.get('screen').height;
export const screenWidth = Dimensions.get('screen').width;
export const wp = (widthPercent: any) => widthPercentageToDP(widthPercent);
export const hp = (heightPercent: any) => heightPercentageToDP(heightPercent);

export const StatusBarHeight = () => {
  return StatusBar.currentHeight;
};

const baseWidth = 375;
export const responsiveSize = (size: number): number => {
  return (size / baseWidth) * screenWidth;
};

export const password_regex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export const titles = [
  '1. Investment Objective',
  '2. Risk Tolerance',
  '3. How likely would you be able to tolerate the value of your account changing +/- 20% over three years.',
  '4. What would you do If the value of your investment dropped by 20%?',
  '5. Investment Horizon',
  '6. Liquidity Needs',
];

export const questions = [
  {
    id: 1,
    question: 'What best describes your investment objective?',
    options: [
      {
        text: 'Capital Preservation:',
        description:
          '(brokerage accounts) I have the preference for the relative safety of my invested capital over return on investments; this includes investing in products such as CD, TBILI and money markets. I am willing to accede the possibility of achieving minimal investment returns in exchange for minimum volatility.',
      },
      {
        text: 'Income:',
        description:
          'I have a preference for low volatility investment to seek a modest level of portfolio returns.',
      },
      {
        text: 'Moderate Growth:',
        description:
          'I have a preference for taking a balanced approach to investments, including focusing on long term growth while managing short term market volatility.',
      },
      {
        text: 'Growth:',
        description:
          'I have a preference for maximizing long term growth. I am willing to assume increased volatility to achieve the objective.',
      },
      {
        text: 'Speculation:',
        description:
          '(Brokerage accounts) I have a preference for investments or trading strategies that are intended to generate outsized returns, and I have little need for current income or liquidity.',
      },
    ],
  },

  {
    id: 2,
    question: '',
    options: [
      {
        text: 'Low:',
        description:
          'I am willing to accept only minimal changes in the value of my portfolio. I understand that my investment returns may be very low because I value reduced risk of principal loss. ( can only be selected with an investment objective of Capital preservation, income of moderate growth).',
      },
      {
        text: 'Moderate:',
        description:
          'I am willing to accept possible principal loss if there is a potential for a moderate increase in the value of my portfolio over time. (Can only be selected with an investment objective of Income, moderate growth or growth)',
      },
      {
        text: 'High:',
        description:
          'I willing to sustain a loss of principal if there is potential for a very significant increase in the value of my portfolio over time. (Can only be selected with a investment objective of moderate growth, growth or speculation)',
      },
    ],
  },
  {
    id: 3,
    question: '',
    options: [
      {
        text: 'Not likely:',
        description:
          'Can only be selected with an investment objective of Capital preservation, income of moderate growth).',
      },
      {
        text: 'Likely:',
        description:
          'Can only be selected with an investment objective of Income, moderate growth or growth).',
      },
      {
        text: 'Very Likely',
        description:
          'Can only be selected with a investment objective of moderate growth, growth or speculation)',
      },
    ],
  },
  {
    id: 4,
    question: '',
    options: [
      {text: 'Sell All', description: ''},
      {text: 'Sell most', description: ''},
      {
        text: 'Do nothing:',
        description:
          'Cannot be selected with an investment Objective of capital preservation',
      },
      {
        text: 'Buy More:',
        description:
          'Cannot be selected with an investment Objective of capital preservation',
      },
    ],
  },
  {
    id: 5,
    question:
      'How long do you plan to invest this money to achieve your financial goal(s)?',
    options: [
      {text: 'Less than 1 year', description: ''},
      {text: '1-3 years', description: ''},
      {text: '3-5 years', description: ''},
      {text: '5-10 years', description: ''},
      {text: 'Greater than 10 years', description: ''},
    ],
  },
  {
    id: 6,
    question:
      'When will you need to take withdrawals from this account exceeding 10%?',
    options: [
      {text: 'Less than 3 years (short term)', description: ''},
      {text: '3-10 years (medium term)', description: ''},
      {text: 'Greater than 10 years (long term)', description: ''},
    ],
  },
];

export const portfolioData: PortfolioItem[] = [
  {name: 'Crypto', value: 30, color: AppColors.primary},
  {name: 'Real Estate', value: 10, color: AppColors.yellowColour},
  {name: 'Industry', value: 25, color: AppColors.purpleColour},
  {name: 'Technology', value: 20, color: AppColors.pinkRedColour},
  {name: 'Energy', value: 15, color: AppColors.cyan},
];

// old function
export const convertIntoSvgData = (data: any, categories: any) => {
  const convertedData = data?.map(
    (item: {category: string; investmentRatio: number}) => {
      return {
        name: item?.category,
        value: item?.investmentRatio,
        color: categories?.find(i => i.title == item.category)?.color || '#000',
      };
    },
  );
  return convertedData || [];
};

// new function changes on client
export const convertIntoUpdatedSvgData = (data: any, categories: any) => {
  const convertedData = data?.map(
    (item: {category: string; percentage: number}) => {
      return {
        name: categories?.find(i => i._id == item.category)?.title,
        value: item?.percentage,
        color: categories?.find(i => i._id == item.category)?.color || '#000',
      };
    },
  );
  return convertedData || [];
};

export const handleColor = (name: string) => {
  switch (name) {
    case 'Crypto':
      return AppColors.primary;
    case 'Real Estate':
      return AppColors.yellowColour;
    case 'Industry':
      return AppColors.purpleColour;
    case 'Technology':
      return AppColors.pinkRedColour;
    case 'Energy':
      return AppColors.cyan;
    default:
      return AppColors.primary;
  }
};

export const injectedJavaScript = `
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = 'body, body * { background-color: white !important; padding-left: 2px; padding-right: 2px }';
  document.head.appendChild(style);
  true; // ensures the script runs correctly
  `;
