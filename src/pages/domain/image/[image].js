import { useRouter } from "next/router";
import React, { useEffect, useState } from 'react';
var w3d = require("@web3yak/web3domain");
import Link from 'next/link';
import useDomainInfo from '../../../hooks/domainInfo';
import { useURLValidation } from '../../../hooks/validate';
import { useNetworkValidation, checkContract } from '../../../hooks/useNetworkValidation';
import { useJsonValue } from "../../../hooks/jsonData";
import { generateJson, generateImage } from '../../../hooks/ipfs';
import TokenURI from '../../../components/TokenURI'; // Adjust the path to the actual location

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
  SkeletonCircle,
  useColorModeValue,
  Card,
  CardBody,
  CardFooter,
  Image,
  Text,
  Kbd,
  ButtonGroup,
  IconButton,
  useClipboard,
  useBoolean,
  InputGroup,
  Input,
  InputRightElement,
  FormControl,
  FormLabel,
  Switch,
  FormHelperText,
  form,
  CircularProgress

} from "@chakra-ui/react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { FaCopy, FaExternalLinkAlt, FaForward } from "react-icons/fa";
import { useAccount, useNetwork } from "wagmi";
import { DOMAIN_TLD, NETWORK_ERROR } from '../../../configuration/Config'


export default function Info() {
  const { isConnected, connector, address } = useAccount();
  const { validateURL } = useURLValidation();
  const isNetworkValid = useNetworkValidation();
  const router = useRouter();
  const { image } = router.query;
  const domain = image ? String(image).toLowerCase() : "";
  const { ownerAddress } = useDomainInfo(domain);
  const [jsonData, setJsonData] = useState(null); // Initialize jsonData as null
  const { getValue } = useJsonValue(jsonData);
  const [error, setError] = useState('');
  const [claimUrl, setClaimUrl] = useState('http://web3domain.org');
  const [isLoading, setIsLoading] = useState(true);
  const [isMainLoading, setIsMainLoading] = useState(true);
  const [flag, setFlag] = useBoolean();
  const [newUrl, setNewUrl] = useState('');
  const [web2Url, setWeb2Url] = useState('');
  const [web3Url, setWeb3Url] = useState('');
  const [visitUrl, setVisitUrl] = useState('');
  const [jsonDataNew, setJsonDataNew] = useState(null); // Initialize jsonDataNew as null


  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }

    console.log('Saving record..');

    console.log(jsonData);

    // Update the jsonDataNew object with the new web3_url value
    const updatedJsonData = {
      ...jsonData,
      records: {
        ...jsonData.records,
        "51": {
          type: "web3_url",
          value: newUrl
        }
      }
    };

    setJsonDataNew(updatedJsonData); // Update the state with the modified jsonData

    console.log(updatedJsonData);
    setIsLoading(false);
  };

  const handleUpload = async () => {
    console.log("Verify record of  " + domain);
    setIsLoading(true);
    if (domain !== 'undefined') {

      console.log(jsonData);

      await genJson();

    }
  }

  async function genJson() {
    //handleSubmit(null); 
    console.log(jsonDataNew);
    const response = await generateJson(jsonDataNew, domain);
    if (response.ok) {
      const responseText = await response.text();

      try {
        const responseObject = JSON.parse(responseText);
        const cidValue = responseObject.cid;
        console.log('https://ipfs.io/ipfs/' + cidValue);
        setClaimUrl('https://ipfs.io/ipfs/' + cidValue);
        setIsLoading(false);


      } catch (error) {
        console.log("Error parsing JSON:", error);
      }

    } else {
      console.log("Error generating JSON.");
      setIsLoading(false);
    }

  }

  useEffect(() => {

    setIsMainLoading(true); // Set isLoading to true whenever the effect runs

    if (domain) {
      const randomNumber = Math.random();
      const url = "https://w3d.name/api/v1/index.php?domain=" + domain + "&" + randomNumber;
      // console.log(url);
      const fetchData = async () => {
        try {
          const response = await fetch(url);
          const json = await response.json();
          setJsonData(json); // Store the json response in the component's state
          setIsMainLoading(false);
          // console.log(json);
        } catch (error) {
          console.log("error", error);
        }
      };

      fetchData();

    }
  }, [domain]);



  // Use another useEffect to set webUrl
  useEffect(() => {

    console.log(jsonData);
    if (jsonData) {
      var web2_url = getValue("web_url");
      //console.log(web2_url);

      var web3_url = getValue("web3_url");
      //console.log(web3_url);


      setWeb2Url(web2_url);
      setWeb3Url(web3_url);

      console.log(web3Url);
      console.log(web2Url);
    }

  }, [jsonData]);


  useEffect(() => {
    
    const isValid = validateURL(web3Url);

    if (isValid) {
      console.log("Valid URL " + web3Url);
      setVisitUrl(web3Url);
    }
    else {
      if (validateURL(web2Url)) {
        setVisitUrl(web2Url);
      }

    }
    console.log(visitUrl);
  }, [visitUrl,web3Url, web2Url]); 
 
  return (

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
        p={{ base: 2, lg: 1 }}
        bgSize={"lg"}
        maxH={"80vh"}
      >
        <Container
          maxW={"3xl"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Kbd><Link href={`/domain/info/${domain}`}>{domain}</Link></Kbd>
          <Box
            textAlign="center"
            alignContent={"center"}
            borderRadius="lg"
            p={{ base: 5, lg: 2 }}
            bgSize={"lg"}
            maxH={"80vh"}
          >
            {isNetworkValid && domain.endsWith('.' + DOMAIN_TLD) ? (
              <Stack
                as={Box}
                textAlign={"center"}
                spacing={{ base: 2, md: 2 }}
                py={{ base: 10, md: 6 }}
              >

                {isMainLoading ? (
                  <Box padding='6' boxShadow='lg' bg='white'>
                    <SkeletonCircle size='10' />
                    <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='3' />
                  </Box>
                ) : (
                  <>
                    {error ? (
                      <p>Error: {error}</p>
                    ) : (
                      <p>

                        {address == ownerAddress ?
                          <form onSubmit={handleSubmit}>
                            <Card
                              direction={{ base: 'column', sm: 'row' }}
                              overflow='hidden'
                              variant='outline'
                              align='center'
                            >

                              <Image
                                ml={2}
                                boxSize='150px'
                                src={jsonData?.image && jsonData.image.startsWith("ipfs://") ? jsonData.image.replace("ipfs://", "https://ipfs.io/ipfs/") : jsonData?.image}
                                alt={jsonData?.name}
                              />

                              <Stack>
                                <CardBody>

                                  <Text mb='4px'>Redirect to:</Text>
                                  <InputGroup>

                                    <Input
                                      value={visitUrl}
                                      placeholder='No website defined!'
                                      size='sm'
                                      disabled="true"
                                    />
                                    {web3Url != null && (
                                      <InputRightElement width='1rem' >

                                        <Link href={`${visitUrl}`} passHref>
                                          <a target="_blank" rel="noopener noreferrer">
                                            <FaExternalLinkAlt mx='2px' />
                                          </a>
                                        </Link>
                                      </InputRightElement>
                                    )}
                                  </InputGroup>
                                  <br />

                                  <FormControl display='flex' alignItems='center'>
                                    <FormLabel htmlFor='change-url' mb='0'>
                                      Turn on Redirects to own link
                                    </FormLabel>
                                    <Switch id='change-url' onChange={() => {
                                      setFlag.toggle();
                                      //handleFlagChange();
                                    }} isChecked={flag} />
                                  </FormControl>

                                  {flag && (
                                    <FormControl mt={2}>
                                      <FormLabel>Your New Website URL</FormLabel>
                                      <Input
                                        type="url"
                                        placeholder="http://"
                                        size="md"
                                        value={newUrl}
                                        onChange={(event) =>
                                          setNewUrl(event.currentTarget.value)
                                        }
                                      />
                                      <FormHelperText>
                                        IPFS & http URL both are supported.<br />
                                        {newUrl}
                                      </FormHelperText>
                                    </FormControl>
                                  )}

                                </CardBody>

                                <CardFooter>
                                  {address == ownerAddress ? (
                                    <div>
                                      <Button rightIcon={<FaForward />} colorScheme="teal" type="submit" width="half" mt={4}>
                                        Save
                                      </Button>
                                      &nbsp;
                                      {jsonDataNew != null ? (
                                        <Button rightIcon={<FaForward />} colorScheme="green" width="half" mt={4} onClick={() => handleUpload()} >

                                          {isLoading ? (

                                            <>  <CircularProgress isIndeterminate size="24px" /> Submitting </>
                                          ) : (
                                            'Verify'
                                          )}

                                        </Button>
                                      ) : (
                                        <></>
                                      )}

                                      &nbsp;
                                      {claimUrl != 'http://web3domain.org' ? (<TokenURI domainName={domain} TokenURI={claimUrl} />) : (<></>)}

                                    </div>
                                  ) : (<>Not authorized</>)}


                                </CardFooter>
                              </Stack>
                            </Card>
                          </form>
                          :

                          <Alert status='error'>
                            <AlertIcon />
                            <AlertTitle>You are not authorized.</AlertTitle>
                          </Alert>

                        }

                      </p>



                    )}
                  </>
                )}

              </Stack>
            ) :
              (<>{NETWORK_ERROR}</>)
            }
          </Box>
        </Container>

      </Box>

    </Flex>
  )
}
