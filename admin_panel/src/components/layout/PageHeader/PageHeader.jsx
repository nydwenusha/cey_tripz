// PageHeader.jsx
import React from 'react';
import { Box, Typography, Button, Breadcrumbs, Link, IconButton, Tooltip, useTheme, useMediaQuery } from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  Help as HelpIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import PropTypes from 'prop-types';

const PageHeader = ({
  title,
  subtitle,
  breadcrumbs,
  showBackButton = false,
  onBackClick,
  primaryAction,
  secondaryActions = [],
  variant = 'default',
  children
}) => {
  const getVariantStyles = () => {
    const variants = {
      default: {
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider'
      },
      elevated: {
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        p: 3
      },
      gradient: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 2
      },
      minimal: {
        bgcolor: 'transparent'
      }
    };
    return variants[variant] || variants.default;
  };

  const theme = useTheme();
  const isMidUp = useMediaQuery(theme.breakpoints.up('md'));


  return (
    <Box sx={{ mb: 4 }}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs sx={{ mb: 2 }}>
          {breadcrumbs.map((crumb, index) => (
            <Link
              key={index}
              href={crumb.href}
              color="inherit"
              underline="hover"
              sx={{
                fontSize: '0.875rem',
                fontWeight: index === breadcrumbs.length - 1 ? 600 : 400
              }}
            >
              {crumb.label}
            </Link>
          ))}
        </Breadcrumbs>
      )}

      {/* Main Header Container */}
      <Box sx={{
        p: variant === 'minimal' ? 0 : 3,
        ...getVariantStyles()
      }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 2
        }}>
          {/* Left Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            {showBackButton && (
              <Tooltip title="Go back">
                <IconButton
                  onClick={onBackClick}
                  sx={{
                    bgcolor: variant === 'gradient' ? 'rgba(255,255,255,0.2)' : 'action.hover',
                    '&:hover': {
                      bgcolor: variant === 'gradient' ? 'rgba(255,255,255,0.3)' : 'action.selected'
                    }
                  }}
                >
                  <ArrowBackIcon sx={{
                    color: variant === 'gradient' ? 'white' : 'inherit'
                  }} />
                </IconButton>
              </Tooltip>
            )}

            <Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: variant === 'gradient' ? 'white' : 'text.primary',
                  mb: subtitle ? 0.5 : 0
                }}
              >
                {title}
              </Typography>

              {subtitle && (
                <Typography
                  variant="body1"
                  sx={{
                    color: variant === 'gradient' ? 'rgba(255,255,255,0.9)' : 'text.secondary',
                    fontSize: '0.95rem'
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>

          {!isMidUp &&
            <br />
          }
          {/* Right Section - Actions */}
          <Box sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            {/* Secondary Actions */}
            {secondaryActions.map((action, index) => (
              <Tooltip key={index} title={action.tooltip || ''}>
                {action.type === 'icon' ? (
                  <IconButton
                    onClick={action.onClick}
                    color={action.color || 'default'}
                    sx={{
                      bgcolor: variant === 'gradient' ? 'rgba(255,255,255,0.2)' : 'action.hover',
                      '&:hover': {
                        bgcolor: variant === 'gradient' ? 'rgba(255,255,255,0.3)' : 'action.selected'
                      }
                    }}
                  >
                    {action.icon}
                  </IconButton>
                ) : (
                  <Button
                    variant={action.variant || 'outlined'}
                    startIcon={action.icon}
                    onClick={action.onClick}
                    size="small"
                    sx={{
                      color: variant === 'gradient' ? 'white' : 'inherit',
                      borderColor: variant === 'gradient' ? 'rgba(255,255,255,0.3)' : 'inherit',
                      '&:hover': {
                        borderColor: variant === 'gradient' ? 'rgba(255,255,255,0.5)' : 'inherit',
                        bgcolor: variant === 'gradient' ? 'rgba(255,255,255,0.1)' : 'inherit'
                      }
                    }}
                  >
                    {action.label}
                  </Button>
                )}
              </Tooltip>
            ))}

            {/* Common utility actions */}
            <Tooltip title="Refresh">
              <IconButton
                sx={{
                  bgcolor: variant === 'gradient' ? 'rgba(255,255,255,0.2)' : 'action.hover',
                  '&:hover': {
                    bgcolor: variant === 'gradient' ? 'rgba(255,255,255,0.3)' : 'action.selected'
                  }
                }}
              >
                <RefreshIcon sx={{
                  color: variant === 'gradient' ? 'white' : 'inherit'
                }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Help">
              <IconButton
                sx={{
                  bgcolor: variant === 'gradient' ? 'rgba(255,255,255,0.2)' : 'action.hover',
                  '&:hover': {
                    bgcolor: variant === 'gradient' ? 'rgba(255,255,255,0.3)' : 'action.selected'
                  }
                }}
              >
                <HelpIcon sx={{
                  color: variant === 'gradient' ? 'white' : 'inherit'
                }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Settings">
              <IconButton
                sx={{
                  bgcolor: variant === 'gradient' ? 'rgba(255,255,255,0.2)' : 'action.hover',
                  '&:hover': {
                    bgcolor: variant === 'gradient' ? 'rgba(255,255,255,0.3)' : 'action.selected'
                  }
                }}
              >
                <SettingsIcon sx={{
                  color: variant === 'gradient' ? 'white' : 'inherit'
                }} />
              </IconButton>
            </Tooltip>

            {/* Primary Action */}
            {primaryAction && (
              <Button
                variant={primaryAction.variant || 'contained'}
                startIcon={primaryAction.icon}
                onClick={primaryAction.onClick}
                size="medium"
                sx={{
                  ml: 1,
                  bgcolor: variant === 'gradient' ? 'white' : 'primary.main',
                  color: variant === 'gradient' ? 'primary.main' : 'white',
                  '&:hover': {
                    bgcolor: variant === 'gradient' ? 'rgba(255,255,255,0.9)' : 'primary.dark'
                  }
                }}
              >
                {primaryAction.label}
              </Button>
            )}
          </Box>
        </Box>

        {/* Additional Content Slot */}
        {children && (
          <Box sx={{ mt: 3 }}>
            {children}
          </Box>
        )}
      </Box>
    </Box>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    href: PropTypes.string
  })),
  showBackButton: PropTypes.bool,
  onBackClick: PropTypes.func,
  primaryAction: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    variant: PropTypes.string,
    icon: PropTypes.node
  }),
  secondaryActions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    variant: PropTypes.string,
    icon: PropTypes.node,
    type: PropTypes.oneOf(['button', 'icon']),
    color: PropTypes.string,
    tooltip: PropTypes.string
  })),
  variant: PropTypes.oneOf(['default', 'elevated', 'gradient', 'minimal']),
  children: PropTypes.node
};

export default PageHeader;