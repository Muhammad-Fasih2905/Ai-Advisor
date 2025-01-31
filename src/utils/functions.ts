export const convert_data = (api_data: any) => {
  return (
    (api_data?.length > 0 ? api_data : []).map((item: any) => {
      return {
        value: item?._id,
        label: item?.title,
      };
    }) || []
  );
};

export const formatDataForChart = (quotes: any) => {
  return {
    labels: quotes.map((quote: any) =>
      new Date(quote.date).toLocaleDateString(),
    ),
    datasets: [
      {
        data: quotes.map((quote: any) => quote.close),
      },
    ],
  };
};

export const handleValues = (value: number) => {
  if (value > 0) {
    return `+${value}%`;
  } else {
    return `${value}%`;
  }
};

export const addCommasValue = (value: number) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || value;
};

export const checkNumberValue = (num: number) => {
  if (num >= 1e12) {
    return `${(num / 1e12).toFixed(3)} Trillion`;
  } else if (num >= 1e9) {
    return `${(num / 1e9).toFixed(3)} Billion`;
  } else if (num >= 1e6) {
    return `${(num / 1e6).toFixed(3)} Million`;
  } else if (num >= 1e3) {
    return `${(num / 1e3).toFixed(3)} Thousand`;
  } else {
    return `${num || 0}`;
  }
};

export const getRandomColor = () => {
  const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
  return randomColor;
};

export const showNotificationImage = (item: any) => {
  if (item?.thumbnail?.resolutions?.length > 0) {
    if (
      item?.thumbnail?.resolutions[1]?.url ||
      item?.thumbnail?.resolutions[0]?.url
    ) {
      return {
        uri:
          item?.thumbnail?.resolutions[1]?.url ||
          item?.thumbnail?.resolutions[0]?.url,
      };
    } else {
      return require('../assets/images/logo.png');
    }
  } else {
    return require('../assets/images/logo.png');
  }
};

export const handleDollarSign = (type: string) => {
  if (type == 'ETFs' || type == 'Money Market Funds') {
    return true;
  } else {
    return false;
  }
};

export const calculateChange = (amount: string, investedAmount: number) => {
  if (investedAmount === 0) {
    return {
      error: 'Invested amount cannot be zero!',
    };
  }
  const percentageChange =
    ((parseFloat(amount) - investedAmount) / investedAmount) * 100;
  const status = percentageChange >= 0 ? 'increase' : 'decrease';
  return {
    percentageChange: percentageChange.toFixed(2),
    status: status,
    absoluteChange: Math.abs(percentageChange).toFixed(2),
  };
};
