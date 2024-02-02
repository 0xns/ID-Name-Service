import { ThemingProps } from '@chakra-ui/react'
import { polygon} from '@wagmi/chains'

export const SITE_NAME = 'ID Domain Name'
export const SITE_DESCRIPTION = 'Hi0x © 2024'
export const SITE_URL = 'https://id.0xns.pro'

export const THEME_INITIAL_COLOR = 'system'
export const THEME_COLOR_SCHEME: ThemingProps['colorScheme'] = 'gray'
export const THEME_CONFIG = { initialColorMode: THEME_INITIAL_COLOR }

export const SOCIAL_MEDIUM = '' //Leave it blank if no values
export const SOCIAL_TWITTER = 'hi0xchat'
export const SOCIAL_GITHUB = '0xns'
export const SOCIAL_LINKEDIN = ''
export const SOCIAL_DISCORD = ''

export const NETWORKS = [polygon]; //polygon, filecoin, polygonMumbai
export const NETWORK_ERROR = "Connect your wallet" //Change network name as required

export const DOMAIN_TLD = 'id' //primary domain name without dot (.)
export const DOMAIN_PRICE_ETH = '5' //price should be equal to contract or higher 
export const DOMAIN_IMAGE_URL = 'https://ipfs.io/ipfs/QmVZo9qYLnYZTMEDbfTXHsjQimoCD9GRstKr6ipePvRWfj' //Image path starts with ipfs:// or https://
export const DOMAIN_NETWORK_CHAIN = 137 //137 for polygon, 314 for filecoin, 80001 form mumbai
export const DOMAIN_DESCRIPTION = 'Web3 Domain Name'
export const DOMAIN_TYPE = "W3D" //W3D for polygon, FVM for Filecoin net
export const DOMAIN_TITLE = "" //Title above the search input field. 
export const DOMAIN_PLACEHOLDER = "Search for ID ... Mint price 5 MATIC" //Placeholder for search input field 

export const ADMIN_WALLET = "0xbed79816b54E75eD54BF217333342C8d271b3b6f" //ETH wallet address 

export const NOTICE_TITLE = "Airdrop"
export const NOTICE_NON_MEMBER = "Become a .ID holder to unlock"

export const DOMAIN_BANNER = "https://i.imgur.com/Ky8J4NM.png" //290x80 size
