import React, { useRef } from 'react';
import { Box } from '@chakra-ui/react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { useAppSelector } from '../store/hooks';

export const CreateChart = React.memo(() => {
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
    const { result, period } = useAppSelector((state) => state.populations);
    let options;
    if (period !== undefined && result !== undefined) {
        const series = result
            .map((pref) => {
                if (pref.isChecked) {
                    return {
                        type: 'line',
                        name: pref.prefName,
                        data: pref.prefData,
                    };
                }
                return null;
            })
            .filter((e) => e !== null);
        options = {
            title: {
                text: '',
            },
            xAxis: {
                title: {
                    text: '年度',
                },
                categories: period,
            },
            yAxis: {
                title: {
                    text: '人口数',
                },
            },
            tooltip: {
                valueSuffix: '人',
            },
            series: series,
        };
    }
    return (
        <Box as='div' width={'90%'} margin={'30px auto 0 auto'}>
            {result &&
                options &&
                options.series !== null &&
                result.filter((e) => e.isChecked && e.prefData).length > 0 && (
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={options}
                        ref={chartComponentRef}
                        immutable={true}
                    />
                )}
        </Box>
    );
});
