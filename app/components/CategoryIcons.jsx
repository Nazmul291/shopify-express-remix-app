import { Button, InlineStack, Text } from '@shopify/polaris';
import './CategoryIcons.css';



export default function CategoryIcons({categoryIcons}) {
// console.log("categoryIcons:",categoryIcons)


  return (
    <>
    <InlineStack>


    {
   categoryIcons?.map((button, index) => (

      <Button key={index} variant="tertiary">
      {/* <img style={{width:"25px"}} src={button.imgSrc} /> */}
      <Text>{button.text}</Text>
    </Button>
  
  ))
}



    </InlineStack>
    </>
  )
}