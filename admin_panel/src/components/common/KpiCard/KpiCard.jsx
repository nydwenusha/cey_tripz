import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

const KpiCard = ({ title, value, change, trend, icon, color, subtitle }) => {
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;
  const trendColor = trend === 'up' ? 'success.main' : 'error.main';

  return (
    <Card sx={{ height: '100%', position: 'relative' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box
            sx={{
              backgroundColor: color,
              borderRadius: 1,
              p: 1,
              mr: 2,
              color: 'white',
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div">
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Box>

        {change && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <TrendIcon sx={{ color: trendColor, mr: 0.5, fontSize: 16 }} />
            <Typography variant="body2" sx={{ color: trendColor }}>
              {change}%
            </Typography>
          </Box>
        )}

        {subtitle && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default KpiCard;