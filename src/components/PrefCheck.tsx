import React, { useEffect } from 'react';
import { Box, Checkbox, Text, Wrap, WrapItem } from '@chakra-ui/react';

import { useAppSelector, useAppDispatch } from '../store/hooks';
import {
    updatePref,
    getPrefList,
    getPrefData,
} from '../population/populationSlice';

export const PrefCheck = React.memo(() => {
    const { result } = useAppSelector((state) => state.populations);
    const dispatch = useAppDispatch();
    useEffect(() => {
        void dispatch(getPrefList());
    }, [dispatch]);
    return (
        <React.Fragment>
            <Text
                fontSize={'2xl'}
                textAlign={'center'}
                backgroundColor={'gray.100'}
            >
                都道府県別人口推移
            </Text>
            <Box as='div' width='90%' margin='0 auto'>
                <Box as='h2' fontSize='20px' color='#464646' marginTop='20px'>
                    都道府県
                </Box>
                <Wrap marginTop='20px'>
                    {result &&
                        result.map((pref) => {
                            return (
                                <WrapItem
                                    fontSize='8px'
                                    border='solid 3px #464646'
                                    borderRadius='10px'
                                    key={pref.prefCode}
                                    transition='all 0.5s'
                                    _hover={{
                                        opacity: '0.5',
                                        transition: 'all 0.5s',
                                    }}
                                >
                                    <Checkbox
                                        padding='0.5em 1em'
                                        width='120px'
                                        onChange={(e) => {
                                            if (pref.prefCode)
                                                dispatch(
                                                    updatePref({
                                                        id: pref.prefCode,
                                                        checked:
                                                            e.target.checked,
                                                    })
                                                );
                                            if (
                                                !('prefData' in pref) &&
                                                pref.prefCode
                                            ) {
                                                void dispatch(
                                                    getPrefData(pref.prefCode)
                                                );
                                            }
                                        }}
                                    >
                                        {pref.prefName}
                                    </Checkbox>
                                </WrapItem>
                            );
                        })}
                </Wrap>
            </Box>
        </React.Fragment>
    );
});
