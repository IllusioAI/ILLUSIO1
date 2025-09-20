"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, off } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAeZpAAIWtaPM6ZQj0rJ8et0SmplJmqjGw",
  authDomain: "illusio-b9d0b.firebaseapp.com",
  databaseURL: "https://illusio-b9d0b-default-rtdb.firebaseio.com",
  projectId: "illusio-b9d0b",
  storageBucket: "illusio-b9d0b.firebasestorage.app",
  messagingSenderId: "877208190248",
  appId: "1:877208190248:web:41adb072ee02c02356641d",
  measurementId: "G-0RX02G217N"
};

// Initialize Firebase (only once)
let app: any = null;
let database: any = null;

const initializeFirebase = () => {
  if (!app) {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
  }
  return { app, database };
};

// Token data interface matching the comprehensive Jupiter API structure
export interface TokenData {
  // Basic token info
  address: string;
  mint: string; // Primary identifier
  name: string;
  symbol: string;
  imageUrl?: string;
  decimals: number;
  dev: string;
  circSupply: number;
  totalSupply: number;
  tokenProgram: string;
  launchpad?: string;
  metaLaunchpad?: string;
  partnerConfig?: string;
  
  // Pool info
  firstPoolId?: string;
  firstPoolCreatedAt: string;
  
  // Holder info
  holderCount: number;
  
  // Audit info
  audit: {
    isSus?: boolean;
    mintAuthorityDisabled?: boolean;
    freezeAuthorityDisabled?: boolean;
    devBalancePercentage?: number;
    topHoldersPercentage?: number;
    devMigrations?: number;
    blockaidHoneypot?: boolean;
    blockaidRugpull?: boolean;
  };
  
  // Organic score
  organicScore: number;
  organicScoreLabel: string;
  tags: string[];
  
  // Price and market data
  fdv: number;
  marketCap: number;
  price?: number;
  priceBlockId?: number;
  liquidity: number;
  bondingCurve?: number;
  
  // Social links
  twitter?: string;
  website?: string;
  telegram?: string;
  
  // Trading stats (24h)
  stats24h: {
    priceChange?: number;
    holderChange?: number;
    liquidityChange?: number;
    buyVolume?: number;
    sellVolume?: number;
    buyOrganicVolume?: number;
    sellOrganicVolume?: number;
    numBuys?: number;
    numSells?: number;
    numTraders?: number;
    numNetBuyers?: number;
  };
  
  // Trading stats (1h)
  stats1h: {
    priceChange?: number;
    holderChange?: number;
    liquidityChange?: number;
    buyVolume?: number;
    sellVolume?: number;
    buyOrganicVolume?: number;
    sellOrganicVolume?: number;
    numBuys?: number;
    numSells?: number;
    numTraders?: number;
    numNetBuyers?: number;
  };
  
  // Trading stats (6h)
  stats6h: {
    priceChange?: number;
    holderChange?: number;
    liquidityChange?: number;
    buyVolume?: number;
    sellVolume?: number;
    buyOrganicVolume?: number;
    sellOrganicVolume?: number;
    numBuys?: number;
    numSells?: number;
    numTraders?: number;
    numNetBuyers?: number;
  };
  
  // Trading stats (5m)
  stats5m: {
    priceChange?: number;
    holderChange?: number;
    liquidityChange?: number;
    buyVolume?: number;
    sellVolume?: number;
    buyOrganicVolume?: number;
    sellOrganicVolume?: number;
    numBuys?: number;
    numSells?: number;
    numTraders?: number;
    numNetBuyers?: number;
  };
  
  // Legacy fields for backward compatibility
  volume24h: number;
  buyers: number;
  sellers: number;
  txCount: number;
  createdAt: string;
  status: "fresh" | "active" | "curve";
  is_on_curve?: boolean;
  isOnCurve?: boolean;
  updated_at?: string;
  created_at?: string;
}

// Firebase token data interface (from Jupiter service) - comprehensive structure
interface FirebaseTokenData {
  // Basic token info
  id: string;
  name: string;
  symbol: string;
  imageUrl: string;
  decimals: number;
  dev: string;
  circSupply: number;
  totalSupply: number;
  tokenProgram: string;
  launchpad?: string;
  metaLaunchpad?: string;
  partnerConfig?: string;
  
  // Pool info
  firstPoolId?: string;
  firstPoolCreatedAt: string;
  
  // Holder info
  holderCount: number;
  
  // Audit info
  audit: {
    isSus?: boolean;
    mintAuthorityDisabled?: boolean;
    freezeAuthorityDisabled?: boolean;
    devBalancePercentage?: number;
    topHoldersPercentage?: number;
    devMigrations?: number;
    blockaidHoneypot?: boolean;
    blockaidRugpull?: boolean;
  };
  
  // Organic score
  organicScore: number;
  organicScoreLabel: string;
  tags: string[];
  
  // Price and market data
  fdv: number;
  marketCap: number;
  price: number;
  priceBlockId?: number;
  liquidity: number;
  bondingCurve?: number;
  
  // Social links
  twitter?: string;
  website?: string;
  telegram?: string;
  
  // Trading stats (24h)
  stats24h: {
    priceChange?: number;
    holderChange?: number;
    liquidityChange?: number;
    buyVolume?: number;
    sellVolume?: number;
    buyOrganicVolume?: number;
    sellOrganicVolume?: number;
    numBuys?: number;
    numSells?: number;
    numTraders?: number;
    numNetBuyers?: number;
  };
  
  // Trading stats (1h)
  stats1h: {
    priceChange?: number;
    holderChange?: number;
    liquidityChange?: number;
    buyVolume?: number;
    sellVolume?: number;
    buyOrganicVolume?: number;
    sellOrganicVolume?: number;
    numBuys?: number;
    numSells?: number;
    numTraders?: number;
    numNetBuyers?: number;
  };
  
  // Trading stats (6h)
  stats6h: {
    priceChange?: number;
    holderChange?: number;
    liquidityChange?: number;
    buyVolume?: number;
    sellVolume?: number;
    buyOrganicVolume?: number;
    sellOrganicVolume?: number;
    numBuys?: number;
    numSells?: number;
    numTraders?: number;
    numNetBuyers?: number;
  };
  
  // Trading stats (5m)
  stats5m: {
    priceChange?: number;
    holderChange?: number;
    liquidityChange?: number;
    buyVolume?: number;
    sellVolume?: number;
    buyOrganicVolume?: number;
    sellOrganicVolume?: number;
    numBuys?: number;
    numSells?: number;
    numTraders?: number;
    numNetBuyers?: number;
  };
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  filterReason: 'token_program' | 'bonk_ending';
  lastUpdated: string;
}

interface FirebaseTokensResponse {
  timestamp?: string;
  total_count?: number;
  filtered_count?: number;
  tokens?: { [key: string]: FirebaseTokenData };
  // Also allow direct token objects as keys
  [key: string]: any;
}

interface ConnectionStatus {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  lastUpdate: Date | null;
}

export const useFirebaseWebSocket = () => {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isConnected: false,
    isConnecting: false,
    error: null,
    lastUpdate: null
  });
  const [loading, setLoading] = useState(true);
  const [pendingTokens, setPendingTokens] = useState<TokenData[]>([]);
  
  // Store original tokens for reset functionality
  const [originalTokens, setOriginalTokens] = useState<TokenData[]>([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  
  // Use ref for search mode to avoid closure issues in Firebase listener
  const isSearchModeRef = useRef(false);
  
  const listenerRef = useRef<any>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const tokenProcessingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Process tokens one by one with animation timing
  const processTokensOneByOne = useCallback((newTokens: TokenData[]) => {
    if (tokenProcessingTimeoutRef.current) {
      clearTimeout(tokenProcessingTimeoutRef.current);
    }


    const processNextToken = (index: number) => {
      if (index >= newTokens.length) {
        return;
      }

      // Stop processing if we're in search mode
      if (isSearchModeRef.current) {
        // Skip processing in search mode
        return;
      }

      const token = newTokens[index];
      
      setTokens(prevTokens => {
        // Double check search mode before updating tokens
        if (isSearchModeRef.current) {
          // Skip token processing in search mode
          return prevTokens;
        }
        
        const existingMints = new Set(prevTokens.map(t => t.mint));
        if (existingMints.has(token.mint)) {
          // Skip if token already exists
          processNextToken(index + 1);
          return prevTokens;
        }

        // Add the new token to the beginning
        const updated = [token, ...prevTokens]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 100); // Keep only most recent 100 tokens

        // Process next token after a 1 second delay (only if not in search mode)
        tokenProcessingTimeoutRef.current = setTimeout(() => {
          processNextToken(index + 1);
        }, 1000); // 1000ms (1 second) delay between tokens

        return updated;
      });
    };

    processNextToken(0);
  }, []);

  // Transform Firebase token data to match comprehensive TokenData interface
  const transformTokenData = useCallback((firebaseToken: FirebaseTokenData): TokenData => {
    // Parse numeric values properly
    const marketCap = typeof firebaseToken.marketCap === 'number' ? firebaseToken.marketCap : 
                     typeof firebaseToken.marketCap === 'string' ? parseFloat(firebaseToken.marketCap) || 0 : 0;
    
    const liquidity = typeof firebaseToken.liquidity === 'number' ? firebaseToken.liquidity : 
                     typeof firebaseToken.liquidity === 'string' ? parseFloat(firebaseToken.liquidity) || 0 : 0;
    
    // Calculate total volume as sum of buyVolume and sellVolume from stats24h
    const buyVolume = typeof firebaseToken.stats24h?.buyVolume === 'number' ? firebaseToken.stats24h.buyVolume : 
                     typeof firebaseToken.stats24h?.buyVolume === 'string' ? parseFloat(firebaseToken.stats24h.buyVolume) || 0 : 0;
    
    const sellVolume = typeof firebaseToken.stats24h?.sellVolume === 'number' ? firebaseToken.stats24h.sellVolume : 
                      typeof firebaseToken.stats24h?.sellVolume === 'string' ? parseFloat(firebaseToken.stats24h.sellVolume) || 0 : 0;
    
    const volume24h = buyVolume + sellVolume;
    
    const price = typeof firebaseToken.price === 'number' ? firebaseToken.price : 
                 typeof firebaseToken.price === 'string' ? parseFloat(firebaseToken.price) || 0 : 0;

    return {
      // Basic token info
      address: firebaseToken.id,
      mint: firebaseToken.id, // Use id as mint for compatibility
      name: firebaseToken.name || 'Unknown',
      symbol: firebaseToken.symbol || 'UNK',
      imageUrl: firebaseToken.imageUrl,
      decimals: firebaseToken.decimals || 6,
      dev: firebaseToken.dev || '',
      circSupply: firebaseToken.circSupply || 0,
      totalSupply: firebaseToken.totalSupply || 0,
      tokenProgram: firebaseToken.tokenProgram || '',
      launchpad: firebaseToken.launchpad,
      metaLaunchpad: firebaseToken.metaLaunchpad,
      partnerConfig: firebaseToken.partnerConfig,
      
      // Pool info
      firstPoolId: firebaseToken.firstPoolId,
      firstPoolCreatedAt: firebaseToken.firstPoolCreatedAt || firebaseToken.createdAt,
      
      // Holder info
      holderCount: firebaseToken.holderCount || 0,
      
      // Audit info
      audit: {
        isSus: firebaseToken.audit?.isSus,
        mintAuthorityDisabled: firebaseToken.audit?.mintAuthorityDisabled,
        freezeAuthorityDisabled: firebaseToken.audit?.freezeAuthorityDisabled,
        devBalancePercentage: firebaseToken.audit?.devBalancePercentage,
        topHoldersPercentage: firebaseToken.audit?.topHoldersPercentage,
        devMigrations: firebaseToken.audit?.devMigrations,
        blockaidHoneypot: firebaseToken.audit?.blockaidHoneypot,
        blockaidRugpull: firebaseToken.audit?.blockaidRugpull,
      },
      
      // Organic score
      organicScore: firebaseToken.organicScore || 0,
      organicScoreLabel: firebaseToken.organicScoreLabel || 'low',
      tags: firebaseToken.tags || [],
      
      // Price and market data
      fdv: firebaseToken.fdv || 0,
      marketCap: marketCap,
      price: price,
      priceBlockId: firebaseToken.priceBlockId,
      liquidity: liquidity,
      bondingCurve: firebaseToken.bondingCurve,
      
      // Social links
      twitter: firebaseToken.twitter,
      website: firebaseToken.website,
      telegram: firebaseToken.telegram,
      
      // Trading stats (24h)
      stats24h: {
        priceChange: firebaseToken.stats24h?.priceChange,
        holderChange: firebaseToken.stats24h?.holderChange,
        liquidityChange: firebaseToken.stats24h?.liquidityChange,
        buyVolume: firebaseToken.stats24h?.buyVolume,
        sellVolume: firebaseToken.stats24h?.sellVolume,
        buyOrganicVolume: firebaseToken.stats24h?.buyOrganicVolume,
        sellOrganicVolume: firebaseToken.stats24h?.sellOrganicVolume,
        numBuys: firebaseToken.stats24h?.numBuys,
        numSells: firebaseToken.stats24h?.numSells,
        numTraders: firebaseToken.stats24h?.numTraders,
        numNetBuyers: firebaseToken.stats24h?.numNetBuyers,
      },
      
      // Trading stats (1h)
      stats1h: {
        priceChange: firebaseToken.stats1h?.priceChange,
        holderChange: firebaseToken.stats1h?.holderChange,
        liquidityChange: firebaseToken.stats1h?.liquidityChange,
        buyVolume: firebaseToken.stats1h?.buyVolume,
        sellVolume: firebaseToken.stats1h?.sellVolume,
        buyOrganicVolume: firebaseToken.stats1h?.buyOrganicVolume,
        sellOrganicVolume: firebaseToken.stats1h?.sellOrganicVolume,
        numBuys: firebaseToken.stats1h?.numBuys,
        numSells: firebaseToken.stats1h?.numSells,
        numTraders: firebaseToken.stats1h?.numTraders,
        numNetBuyers: firebaseToken.stats1h?.numNetBuyers,
      },
      
      // Trading stats (6h)
      stats6h: {
        priceChange: firebaseToken.stats6h?.priceChange,
        holderChange: firebaseToken.stats6h?.holderChange,
        liquidityChange: firebaseToken.stats6h?.liquidityChange,
        buyVolume: firebaseToken.stats6h?.buyVolume,
        sellVolume: firebaseToken.stats6h?.sellVolume,
        buyOrganicVolume: firebaseToken.stats6h?.buyOrganicVolume,
        sellOrganicVolume: firebaseToken.stats6h?.sellOrganicVolume,
        numBuys: firebaseToken.stats6h?.numBuys,
        numSells: firebaseToken.stats6h?.numSells,
        numTraders: firebaseToken.stats6h?.numTraders,
        numNetBuyers: firebaseToken.stats6h?.numNetBuyers,
      },
      
      // Trading stats (5m)
      stats5m: {
        priceChange: firebaseToken.stats5m?.priceChange,
        holderChange: firebaseToken.stats5m?.holderChange,
        liquidityChange: firebaseToken.stats5m?.liquidityChange,
        buyVolume: firebaseToken.stats5m?.buyVolume,
        sellVolume: firebaseToken.stats5m?.sellVolume,
        buyOrganicVolume: firebaseToken.stats5m?.buyOrganicVolume,
        sellOrganicVolume: firebaseToken.stats5m?.sellOrganicVolume,
        numBuys: firebaseToken.stats5m?.numBuys,
        numSells: firebaseToken.stats5m?.numSells,
        numTraders: firebaseToken.stats5m?.numTraders,
        numNetBuyers: firebaseToken.stats5m?.numNetBuyers,
      },
      
      // Legacy fields for backward compatibility
      volume24h: volume24h,
      buyers: firebaseToken.stats24h?.numBuys || 0,
      sellers: firebaseToken.stats24h?.numSells || 0,
      txCount: (firebaseToken.stats24h?.numBuys || 0) + (firebaseToken.stats24h?.numSells || 0),
      createdAt: firebaseToken.createdAt,
      created_at: firebaseToken.createdAt, // Add for compatibility
      updated_at: firebaseToken.lastUpdated, // Add for compatibility
      status: "fresh" as const, // All Jupiter tokens are fresh (not used for filtering)
      is_on_curve: false, // Default to false
      isOnCurve: false // Default to false
    };
  }, []);

  // Connect to Firebase Realtime Database
  const connect = useCallback(() => {
    
    if (connectionStatus.isConnected || connectionStatus.isConnecting || listenerRef.current) {
      return;
    }

    setConnectionStatus(prev => ({ ...prev, isConnecting: true, error: null }));
    setLoading(true);

    try {
      const { database: db } = initializeFirebase();
      const tokensRef = ref(db, 'jupiter_tokens/recent');
      
      listenerRef.current = onValue(
        tokensRef,
        (snapshot) => {
          const data: FirebaseTokensResponse | null = snapshot.val();
          
          if (data) {
            // Handle both data structures: direct tokens object or wrapped in tokens property
            const tokensData = data.tokens || data;
            
            // Filter out non-token properties (like total_count)
            const tokenEntries = Object.entries(tokensData).filter(([key, value]) => 
              typeof value === 'object' && value !== null && value.id
            );
            
            // Transform Firebase tokens to our format
            const transformedTokens = tokenEntries
              .map(([key, tokenData]) => transformTokenData(tokenData as FirebaseTokenData))
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            // Tokens transformed for display
            
            // Check if we're in search mode - if so, SKIP token updates
            setTokens(prevTokens => {
              // If in search mode, don't update tokens - keep the current search result
              if (isSearchModeRef.current) {
                // Search mode active - keeping current tokens
                return prevTokens; // Keep current tokens (search result)
              }
              
              // Normal mode - process new tokens one by one for smooth animation
              const existingMints = new Set(prevTokens.map(t => t.mint));
              const newTokens = transformedTokens.filter(token => !existingMints.has(token.mint));
              
              if (newTokens.length > 0) {
                // Processing new tokens with animation
                // Process tokens one by one with animation timing
                processTokensOneByOne(newTokens);
              }
              
              return prevTokens; // Don't update immediately, let processTokensOneByOne handle it
            });
            setConnectionStatus({
              isConnected: true,
              isConnecting: false,
              error: null,
              lastUpdate: new Date()
            });
            setLoading(false);
            reconnectAttempts.current = 0; // Reset on successful connection
          } else {
            // Only clear tokens if not in search mode
            if (!isSearchModeRef.current) {
              setTokens([]);
            } else {
              // Search mode - preserving current tokens
            }
            setConnectionStatus(prev => ({
              ...prev,
              isConnected: true,
              isConnecting: false,
              error: null,
              lastUpdate: new Date()
            }));
            setLoading(false);
          }
        },
        (error) => {
          console.error('Firebase Realtime Database error:', error);
          setConnectionStatus({
            isConnected: false,
            isConnecting: false,
            error: error.message,
            lastUpdate: null
          });
          setLoading(false);
          
          // Attempt reconnection
          if (reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current++;
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
            
            reconnectTimeoutRef.current = setTimeout(() => {
              connect();
            }, delay);
          }
        }
      );
    } catch (error) {
      console.error('Error setting up Firebase listener:', error);
      setConnectionStatus({
        isConnected: false,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        lastUpdate: null
      });
      setLoading(false);
    }
  }, [connectionStatus.isConnected, connectionStatus.isConnecting, transformTokenData]);

  // Disconnect from Firebase
  const disconnect = useCallback(() => {
    if (listenerRef.current) {
      const { database: db } = initializeFirebase();
      const tokensRef = ref(db, 'jupiter_tokens/recent');
      off(tokensRef, 'value', listenerRef.current);
      listenerRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (tokenProcessingTimeoutRef.current) {
      clearTimeout(tokenProcessingTimeoutRef.current);
      tokenProcessingTimeoutRef.current = null;
    }
    
    setConnectionStatus({
      isConnected: false,
      isConnecting: false,
      error: null,
      lastUpdate: null
    });
    reconnectAttempts.current = 0;
  }, []);

  // Manual reconnection
  const reconnect = useCallback(() => {
    disconnect();
    setTimeout(() => {
      connect();
    }, 1000);
  }, [disconnect, connect]);

  // Set up connection on mount
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
      // Clear any pending token processing
      if (tokenProcessingTimeoutRef.current) {
        clearTimeout(tokenProcessingTimeoutRef.current);
        tokenProcessingTimeoutRef.current = null;
      }
    };
  }, []); // Remove dependencies to prevent re-connection loops

  // Cleanup on unmount is handled in the main useEffect above

  // Debug logging removed for production

  // Add a searched token to the list (force add even if exists)
  const addToken = useCallback((newToken: any, forceAdd: boolean = true) => {
    // If in search mode, ignore regular addToken calls
    if (isSearchModeRef.current) {
      return;
    }
    
    setTokens(prevTokens => {
      const existingMints = new Set(prevTokens.map(t => t.mint));
      
      if (existingMints.has(newToken.mint) && !forceAdd) {
        return prevTokens; // Don't add if already exists and not forcing
      }
      
      if (existingMints.has(newToken.mint) && forceAdd) {
        // Remove the existing token first, then add the new one
        const withoutExisting = prevTokens.filter(t => t.mint !== newToken.mint);
        const updated = [newToken, ...withoutExisting]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 100); // Keep only most recent 100 tokens
        
        return updated;
      }
      
      // Add the new token to the beginning
      const updated = [newToken, ...prevTokens]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 100); // Keep only most recent 100 tokens
      
      return updated;
    });
  }, []);

  // Replace all tokens with just the searched token
  const replaceWithSearchToken = useCallback((searchToken: any) => {
    // Clear any pending token processing
    if (tokenProcessingTimeoutRef.current) {
      clearTimeout(tokenProcessingTimeoutRef.current);
      tokenProcessingTimeoutRef.current = null;
    }
    
    setTokens(prevTokens => {
      // Store original tokens for reset
      if (!isSearchMode) {
        setOriginalTokens(prevTokens);
        setIsSearchMode(true);
        isSearchModeRef.current = true;
      }
      
      // Return only the searched token
      return [searchToken];
    });
  }, [isSearchMode]);

  // Reset to original tokens
  const resetToOriginalTokens = useCallback(() => {
    setTokens(originalTokens);
    setIsSearchMode(false);
    isSearchModeRef.current = false;
    setOriginalTokens([]);
  }, [originalTokens]);

  return {
    tokens,
    connectionStatus,
    loading,
    reconnect,
    disconnect,
    connect,
    addToken,
    replaceWithSearchToken,
    resetToOriginalTokens,
    isSearchMode
  };
};
