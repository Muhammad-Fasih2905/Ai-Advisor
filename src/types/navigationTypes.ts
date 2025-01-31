export type RootStackParamList = {
  splash: undefined;
  signin: undefined;
  signup: undefined;
  questionnaire: undefined;
  verifycode: undefined;
  forgotpassword: undefined;
  resetlink: undefined;
  home: any;
  addinvestment: undefined;
  investmentarticlesdetails: {item: any};

  bestinvesting: undefined;
  recommendationdetail: {symbol: any, image: any, stockType: string};
  editprofile: undefined;
  changepassword: undefined;
  privacypolicy: undefined;
  termsconditions: undefined;
  notificationScreen: undefined;
  faq: undefined;
  BestInvestment: undefined;
  profile: undefined;
  ShowArticles: {item: any};
  Questionnaire: undefined
};


declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}
