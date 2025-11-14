#!/bin/bash

# POS System Switcher Script
# Easily switch between different POS systems

echo "========================================="
echo "  JV POS System Switcher"
echo "========================================="
echo ""
echo "Available POS Systems:"
echo "  1) Enhanced POS (Default - Full-featured)"
echo "  2) Nocturne POS (New - Modern UI from Lovable)"
echo "  3) Classic POS (Simple - Basic features)"
echo ""
read -p "Select POS system (1-3): " choice

CONFIG_FILE="src/frontend/config/posConfig.js"

case $choice in
  1)
    echo "Switching to Enhanced POS..."
    sed -i 's/export const ACTIVE_POS_SYSTEM = POS_SYSTEMS\.[A-Z]*/export const ACTIVE_POS_SYSTEM = POS_SYSTEMS.ENHANCED/' "$CONFIG_FILE"
    echo "✅ Enhanced POS activated!"
    ;;
  2)
    echo "Switching to Nocturne POS..."
    sed -i 's/export const ACTIVE_POS_SYSTEM = POS_SYSTEMS\.[A-Z]*/export const ACTIVE_POS_SYSTEM = POS_SYSTEMS.NOCTURNE/' "$CONFIG_FILE"
    echo "✅ Nocturne POS activated!"
    ;;
  3)
    echo "Switching to Classic POS..."
    sed -i 's/export const ACTIVE_POS_SYSTEM = POS_SYSTEMS\.[A-Z]*/export const ACTIVE_POS_SYSTEM = POS_SYSTEMS.CLASSIC/' "$CONFIG_FILE"
    echo "✅ Classic POS activated!"
    ;;
  *)
    echo "❌ Invalid selection. No changes made."
    exit 1
    ;;
esac

echo ""
echo "Current configuration:"
grep "export const ACTIVE_POS_SYSTEM" "$CONFIG_FILE"
echo ""
echo "Restart your development server for changes to take effect."
