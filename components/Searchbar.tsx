"use client"

import { scrapeAndStoreProduct } from "@/lib/actions";
import { scrapeAmazonProduct } from "@/lib/scraper";
import { FormEvent, useState } from "react";

const isValidAmazonProductURL = (url: string) =>{
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;
    console.log(hostname);
    

    if(
      hostname.includes('amazon.com') ||
      hostname.includes('amazon.') ||
      hostname.endsWith('amazon')
    ) {
      return true;
    }
  } catch (error) {
    return false;
  }
}

const Searchbar = () => {

  const [searchPrompt, setSearchPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();     //basically is not to just reload the page when the form is submitted.

    const isValidLink = isValidAmazonProductURL(searchPrompt);

    if(!isValidLink) return alert('Please provide a valid Amazon Link')

    try {
      setIsLoading(true);

      //scrape a product page
      console.log(searchPrompt);
      
      const location = await scrapeAndStoreProduct(searchPrompt);
      window.location.href = `http://localhost:3000${location}`;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <form
      className="flex flex-wrap gap-4 mt-12"
      onSubmit={handleSubmit}
    >
      <input 
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="Enter product link"
        className="searchbar-input"
      />

      <button 
        type="submit" 
        className="searchbar-btn"
        disabled={searchPrompt === ''}
      >
        {isLoading ? 'Searching' : 'Search'}
      </button>
    </form>
  )
}

export default Searchbar