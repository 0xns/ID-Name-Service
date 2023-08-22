import { useRouter } from "next/router";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ethers } from 'ethers';
import { generateJson } from '../../../hooks/ipfs';
import { useDomainValidation } from '../../../hooks/validate';

import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import {
  Box,
  Button,
  Container,
  Flex,
  SkeletonText,
  Skeleton,
  CardHeader,
  Heading,
  Stack,
  Divider,
  SkeletonCircle,
  useColorModeValue,
  Card,
  CardBody,
  CardFooter,
  Image,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from '@chakra-ui/icons'; // Assuming this is how ExternalLinkIcon is imported in your project

import abiFile from '../../../abiFile.json';
import { DOMAIN, DOMAIN_PRICE_ETH, DOMAIN_IMAGE_URL, DOMAIN_NETWORK_CHAIN, DOMAIN_DESCRIPTION } from '../../../configuration/Config'


//const CONTRACT_ADDRESS = '0x7D853F9A29b3c317773A461ed87F54cdDa44B0e0'; //Polygon
const CONTRACT_ADDRESS = '0xf89F5492094b5169C82dfE1cD9C7Ce1C070ca902'; // Mumbai



export default function Info() {

  const { isValidDomain, validateDomain } = useDomainValidation(); // Use the correct variable names

  const uniqueId = Math.round(Date.now() * Math.random()).toString();
  const { address, connector, isConnected } = useAccount()
  const router = useRouter();
  const { mint } = router.query;

  const domain = mint ? String(mint).toLowerCase() : ''; 

  const [domainName, setDomainName] = useState('theinitialdomaintest.test');
  const [claimId, setClaimId] = useState(uniqueId); // Using claimId state instead of claim_id variable
  const [claimTransferTo, setClaimTransferTo] = useState('0x8D714B10B719c65B878F2Ed1436A964E11fA3271');
  const [claimUrl, setClaimUrl] = useState('http://yahoo.com');

  const claim_id = '8888888';
  const claim_name = domain;
  const claim_url = 'http://yahoo.com';
  const claim_transfer_to = '0x8D714B10B719c65B878F2Ed1436A964E11fA3271';
  const amount = DOMAIN_PRICE_ETH;


  const handleValidation = (domaintest) => {
    validateDomain(domaintest); // Call the validation function here
  };



  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: abiFile.abi,
    functionName: 'claim',
    args: [claimId, domainName, claimUrl, claimTransferTo],
    overrides: {
      value: ethers.utils.parseEther(DOMAIN_PRICE_ETH)
    }
  })
  const { data, error, isError, write } = useContractWrite(config)
  // console.log(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })


  const handleMint = async () => {
    console.log("hello " + domain);
    handleValidation(domain);
    if (isValidDomain) {

      setDomainName(domain);
      setClaimId(uniqueId); // Update claimId state
      setClaimTransferTo(address); // Update claimTransferTo state

      if (!isPrepareError) {
        write();
      }
      else {
        console.log(prepareError);
        showAlert("Network issue!")
      }
    }
    else {
      console.log("Invalid Domain Name " + domain);
    }

  }
  const toast = useToast();
  function showAlert(err) {

    toast({
      title: 'Error',
      description: err,
      status: 'warning',
      duration: 4000,
      isClosable: false,
    })
  }



  useEffect(() => {

    async function fetchData() {

      if (domain !== 'undefined') {
        const array = { "name": domain, "description": DOMAIN_DESCRIPTION, "image": DOMAIN_IMAGE_URL, "attributes": [{ "trait_type": "domain", "value": domain }, { "trait_type": "level", "value": "2" }, { "trait_type": "length", "value": 8 }] };
        console.log(array);
        console.log('fetch data running...');
        const response = await generateJson(array, domain);
        if (response.ok) {
          const responseText = await response.text();

          try {
            const responseObject = JSON.parse(responseText);
            const cidValue = responseObject.cid;
            console.log(cidValue);
            setClaimUrl('https://ipfs.io/ipfs/' + cidValue);
          } catch (error) {
            console.log("Error parsing JSON:", error);
          }
        } else {
          console.log("Error generating JSON.");
        }
      }
    }
    fetchData();

  }, [domain, address]);
  return (
      <>

<Flex
      align="center"
      justify="center"
      bg={useColorModeValue("white", "gray.700")}
      borderRadius="md"
      color={useColorModeValue("gray.700", "whiteAlpha.900")}
      shadow="base"
    >
      <Box
        textAlign="center"
        alignContent={"center"}
        borderRadius="lg"
        p={{ base: 5, lg: 2 }}
        bgSize={"lg"}
        maxH={"80vh"}
      >
        <Container
          maxW={"3xl"}
          alignItems={"center"}
          justifyContent={"center"}
        >
        <Card
          direction={{ base: 'column', sm: 'row' }}
          overflow='hidden'
          variant='outline'
        >
          <Image
            objectFit='cover'
            maxW={{ base: '100%', sm: '200px' }}
            src={DOMAIN_IMAGE_URL}
            alt={domain}
          />

          <Stack>
            <CardBody>
              <Heading size='md'>
                {domainName != 'theinitialdomaintest.test' ?

                  (<div>{domainName}</div>)
                  :
                  (<div>Mint Domain</div>)

                }

              </Heading>

              <Text py='2'>
                {DOMAIN_DESCRIPTION}


              </Text>
            </CardBody>

            <CardFooter>
              {domainName !== 'theinitialdomaintest.test' &&
                (!isSuccess ? (
                  <Button variant='solid' colorScheme='blue' onClick={() => handleMint()}>
                    {isLoading ? 'Minting...' : 'Mint'}
                  </Button>
                ) : null)}
              {domainName === 'theinitialdomaintest.test' && (
                <Button variant='solid' colorScheme='yellow' onClick={() => handleMint()}>
                  Configure Domain
                </Button>
              )}

{isSuccess && (
          <div>
&nbsp;
                            <Button variant='solid' colorScheme='yellow'>
                            <Link href={`/domain/manage/${domain}`}>Manage Domain</Link>
                            </Button>
</div>)}
            </CardFooter>

          </Stack>
        </Card>


        {(isError) && (
          <div>
            <Alert status='error'>
              <AlertIcon />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{(prepareError || error)?.message}</AlertDescription>
            </Alert></div>
        )}

        {isSuccess && (
          <div>

                    <Alert
              status='success'
              variant='subtle'
              flexDirection='column'
              alignItems='center'
              justifyContent='center'
              textAlign='center'
              height='200px'
            >
              <AlertIcon boxSize='40px' mr={0} />
              <AlertTitle mt={4} mb={1} fontSize='lg'>
                Successfully minted your NFT!
              </AlertTitle>
              <AlertDescription maxWidth='sm'>
                You can now manage your domain.
                <Divider />

                <Link href={`https://polygonscan.com/tx/${data?.hash}`} passHref>
                  <a target="_blank" rel="noopener noreferrer">
                    Check transaction at Polygonscan <ExternalLinkIcon mx='2px' />
                  </a>
                </Link>

              </AlertDescription>
            </Alert>


          </div>
        )}

</Container></Box></Flex>
      </>

)
}