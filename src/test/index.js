const chalk = require('chalk')

const getOutput = require('../utils/getOutput.js');
const parseLine = require('../utils/parseLine.js');
const encode = require('../utils/encode.js');

const parsedOutput = [
  {
    file: './components/order-elements/after-rating-popup/index.tsx',
    start: 1576,
    length: 3,
    code: 2339,
    category: 1,
    messageText: "Property 'foo' does not exist on type 'AfterRatingPopupState'."
  },
  {
    file: './components/order-elements/after-rating-popup/index.tsx',
    start: 2230,
    length: 3,
    code: 2339,
    category: 1,
    messageText: "Property 'bar' does not exist on type 'AfterRatingPopupState'."
  },
  {
    file: './components/order-elements/after-rating-popup/index.tsx',
    start: 2531,
    length: 7,
    code: 2322,
    category: 1,
    messageText: {
      messageText: "Type '{ onClose: () => void; }' is not assignable to type 'IntrinsicAttributes & RefAttributes<unknown>'.",
      category: 1,
      code: 2322,
    }
  },
  {
    file: './components/order-elements/after-rating-popup/index.tsx',
    start: 2743,
    length: 5,
    code: 2322,
    category: 1,
    messageText: {
      messageText: "Type '{ style: { paddingHorizontal: number; marginTop: number; }; }' is not assignable to type 'IntrinsicAttributes & RefAttributes<unknown>'.",
      category: 1,
      code: 2322,
    }
  }
]

// group by outputs based on input files
const groupedOutput = {}
parsedOutput.forEach(e => {
  if (groupedOutput[e.file] === undefined) {
    groupedOutput[e.file] = []
  }
  groupedOutput[e.file].push(e)
})

for (const [k, v] of Object.entries(groupedOutput)) {
  const fileBuff = encode(`
  import { observe, useRelinx } from '@xhs/relinx';
  import { ActionSheet2 } from '@xhs/spectrum';
  import React, { useCallback, useEffect, useMemo, useRef } from 'react';
  import {
    Animated,
    Dimensions,
    NativeScrollEvent,
    ScrollView,
    StyleSheet,
    View,
  } from 'react-native';
  import { withErrorBoundary } from 'shared/cyan-error-boundary';
  
  import GoodsList from './components/goods-list';
  import Header from './components/header';
  import Title from './components/title';
  import { AfterRatingPopupModel } from './model';
  
  const WIDTH = Dimensions.get('screen').width;
  
  const BACKGROUND_WHITE =
    'https://picasso-static.xiaohongshu.com/fe-platform/9bbb3831c1e16482d380ae1e0981a823fb042cfa.png';
  const BACKGROUND_WHITE_REDPACKET =
    'https://picasso-static.xiaohongshu.com/fe-platform/1fc1c7bd958bd726bc47c75ae9495fd92f372ca2.png';
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      paddingBottom: 60,
      maxHeight: 609,
    },
    headerImg: {
      width: '100%',
      height: (164 * WIDTH) / 375,
      position: 'absolute',
      top: 0,
    },
    header: {
      padding: 14,
    },
    content: {
      paddingHorizontal: 16,
      marginTop: 24,
    },
  });
  
  const AfterRatingPopup: React.FC = () => {
    const [state, dispatch] = useRelinx<
      { afterRatingPopup: AfterRatingPopupModel },
      'afterRatingPopup'
    >('afterRatingPopup');
  
    const opacityAnim = useRef(new Animated.Value(100));
  
    const { participatedReviewActivityInfoToOrder } = state;
  
    console.log('!!👉 index.tsx: 58', state.foo);
  
    const backgroundImage = useMemo(() => {
      // RED_ENVELOPE = 1
      if (participatedReviewActivityInfoToOrder?.incentiveType === 1) {
        return BACKGROUND_WHITE_REDPACKET;
      }
      return BACKGROUND_WHITE;
    }, [participatedReviewActivityInfoToOrder]);
  
    const handleClose = useCallback(() => {
      dispatch({
        type: 'afterRatingPopup/hide',
      });
    }, [dispatch]);
  
    const handleScroll = useCallback((e: { nativeEvent: NativeScrollEvent }) => {
      const { nativeEvent } = e;
      const y = nativeEvent.contentOffset.y;
      opacityAnim.current.setValue(y < 57 ? 1 - y / 57 : 0);
    }, []);
  
    console.log('!!👉 index.tsx: 58', state.bar);
  
    return (
      <View style={styles.container}>
        <Animated.Image
          style={[
            styles.headerImg,
            {
              opacity: opacityAnim.current,
            },
          ]}
          source={{ uri: backgroundImage }}
        />
        <View style={styles.header}>
          <Header onClose={handleClose} />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <Title />
          <GoodsList style={styles.content} />
        </ScrollView>
      </View>
    );
  };
  
  const PopupProxy = () => {
    const [state, dispatch] = useRelinx<
      { afterRatingPopup: AfterRatingPopupModel },
      'afterRatingPopup'
    >('afterRatingPopup');
  
    const popupInstance = useRef('');
  
    const { visible } = state;
  
    const hidePopup = useCallback(() => {
      // ActionSheet 没有初始化时不要执行
      if (!popupInstance.current) {
        return;
      }
      ActionSheet2.destroy(popupInstance.current);
      dispatch({
        type: 'afterRatingPopup/hide',
      });
    }, [dispatch]);
  
    const showPopup = useCallback(() => {
      popupInstance.current = ActionSheet2.show({
        showCancel: false,
        afterClose: hidePopup,
        children: <AfterRatingPopup />,
      });
    }, [dispatch]);
  
    useEffect(() => {
      if (visible) {
        showPopup();
      } else {
        hidePopup();
      }
    }, [visible]);
  
    return null;
  };
  
  const ObservePopupProxy = observe(PopupProxy);
  ObservePopupProxy.displayName = 'AfterRatingPopup';
  
  export default withErrorBoundary(ObservePopupProxy);
  `)
  console.log(chalk.underline.bold(k))
  for (const err of v) {
    const meta = parseLine(fileBuff, err.start, err.length)
    console.log(getOutput(err.messageText, meta))
    console.log()
  }
  console.log()
}

// summary
console.log(chalk.bold.bgRed(`Typescript checked failed.`))
console.log(chalk.bold.red(`Found ${parsedOutput.length} error(s) in ${Object.keys(groupedOutput).length} file(s).\r\n\r\n`))
