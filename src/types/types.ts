import {ImageStyle, StyleProp, TextStyle, ViewStyle} from 'react-native';

export interface AuthTitleProps {
  title?: string;
  subTitle?: string;
  titleColor?: string;
  subTitleColor?: string;
  titleSize?: number;
  subtitleSize?: number;
  titleWeight?:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  index?: number;
  numberOfLines?: number | undefined;
}

export interface AppHeaderProps {
  title?: string;
  rightIcon?: boolean;
  titleStyle?: TextStyle;
  type?: string;
  enableBack?: boolean;
  mainContainerStyle?: ViewStyle;
  leftIconColor?: string;
  createLeftIcon?: any;
  createRightIcon?: any;
  iconContainerStyle?: ViewStyle;
}

export interface AlreadyTitleProps {
  title: string;
  subTitle: string;
  onPress: () => void;
  titleColor?: string;
}

export interface CardComponentProps {
  icon?: string;
  title: string;
  amount: string;
  percentage?: string;
}

export interface selectedAnswer {
  _id: string;
  description: string;
  sequence: number;
  title: string;
}

export interface PortfolioItem {
  name: string;
  value: number;
  color: string;
}

export interface CustomAppModalProps {
  visible?: boolean;
  setVisible?: any;
  style?: StyleProp<ViewStyle>;
  children: any;
}

export interface InvestmentCardProps {
  item?: any;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export interface RecentSearchCardProps {
  item: any;
}

interface StockSummary {
  change: number;
  changePercent: string;
  currency: string;
  longName: string;
  price: string;
  quotes: any;
  shortName: string;
  symbol: string;
}

export interface TrendingStockTypes {
  summary: StockSummary;
  symbol: string;
}

export interface ThumbnailResolution {
  width: number;
  height: number;
  url: string;
}

export interface Thumbnail {
  resolutions: ThumbnailResolution[];
}

export interface NotificationNews {
  _id: string;
  createdAt: string;
  description: string;
  link: string;
  readBy: string[];
  thumbnail: Thumbnail;
  type: string;
}

export interface ChartDataProps {
  color: string;
  name: string;
  value: number;
}
