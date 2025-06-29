import {
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Typography,
  Box,
  Link,
  Flex,
  PageLink,
  Pagination,
  PreviousLink,
  NextLink,
  SearchForm,
  Searchbar,
} from '@strapi/design-system';

import { Trash } from '@strapi/icons';

import axios from 'axios';
import { useState, useEffect, FormEvent } from 'react';

import formattedDate from '../utils/formattedDate';
import PublishButton from './PublishButton';
import DevToIcon from './DevToIcon';

const PublishingTable = () => {
  const [posts, setPosts] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');

  const postsPerPage = 5;

  console.log('posts', posts);

  const handleFetchPosts = async (page: number) => {
    // Calculate the start index
    const start = (page - 1) * postsPerPage;

    try {
      const response = await axios.get(`/content-publisher/posts?start=${start}`);
      setPosts(response.data.posts);
      setPageCount(Math.ceil(response.data.totalPosts / postsPerPage));
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleSearchPost = async (event: FormEvent, page: number) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const start = (page - 1) * postsPerPage; // Calculate the start index for the paginated search

    // If the search value is empty, fetch all posts
    if (!searchValue.trim()) {
      setSearchValue('');
      handleFetchPosts(1);
      return;
    }

    try {
      // Make a GET request to the search endpoint
      const response = await axios.get(
        `/content-publisher/search?start=${start}&search=${searchValue}`
      );

      setPosts(response.data.posts); // Assuming the API returns matching posts
      setPageCount(Math.ceil(response.data.totalPosts / postsPerPage));
    } catch (error) {
      console.error('Error searching posts:', error);
    }
  };

  const handlePageChange = (e: FormEvent, page: number) => {
    if (page < 1 || page > pageCount) return;
    setCurrentPage(page);

    if (searchValue) {
      handleSearchPost(e, page);
    } else {
      handleFetchPosts(page);
    }
  };

  const handleDeletePost = async (id: string) => {
    const response: Response = await axios.delete(
      `/content-publisher/delete-post?postId=${id}`,
      {}
    );
    handleFetchPosts(1);
  };

  useEffect(() => {
    handleFetchPosts(currentPage);
  }, []);

  return (
    <Box>
      <Box padding={8} margin={20}>
        <Box paddingBottom={2} width="30%">
          <SearchForm
            onSubmit={(e: FormEvent) => {
              handleSearchPost(e, currentPage);
            }}
          >
            <Searchbar
              size="M"
              name="searchbar"
              onClear={() => {
                setSearchValue('');
                handleFetchPosts(1);
              }}
              value={searchValue}
              onChange={(e: any) => setSearchValue(e.target.value)}
              clearLabel="Clearing the plugin search"
              placeholder="e.g: article title"
            >
              Searching for a plugin
            </Searchbar>
          </SearchForm>
        </Box>
        <Table colCount={7} rowCount={posts.length + 1}>
          <Thead>
            <Tr>
              <Th>
                <Typography variant="sigma" textColor="neutral600">
                  Article ID
                </Typography>
              </Th>
              <Th>
                <Typography variant="sigma" textColor="neutral600">
                  Date Created
                </Typography>
              </Th>
              <Th>
                <Typography variant="sigma" textColor="neutral600">
                  Article Title
                </Typography>
              </Th>
              <Th>
                <Typography variant="sigma" textColor="neutral600">
                  Article Link
                </Typography>
              </Th>
              <Th>
                <Flex gap={2} direction="row" alignItems="center">
                  {/* Dev.to icon */}
                  <DevToIcon />
                  <Typography variant="sigma">Dev.to</Typography>
                </Flex>
              </Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {posts.map((post: any) => (
              <Tr key={post.id}>
                <Td>
                  <Typography textColor="neutral800">{post.id}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">
                    {formattedDate(post.article?.updatedAt)}
                  </Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">
                    {post.article?.title.slice(0, 30)}...
                  </Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">
                    <Link
                      href={`http://localhost:1337/admin/content-manager/collection-types/api::article.article/${post.article?.documentId}`}
                    >
                      {post.article?.title.slice(0, 30)}...
                    </Link>
                  </Typography>
                </Td>
                <Td>
                  <PublishButton post={post} type="devto" />
                </Td>
                <Td>
                  <Trash
                    onClick={() => {
                      handleDeletePost(post.documentId);
                    }}
                    style={{ cursor: 'pointer', color: 'red' }}
                    width={20}
                    height={20}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      {posts.length <= 0 ? (
        <Flex
          gap={{
            large: 2,
          }}
          direction={{
            medium: 'column',
          }}
          alignItems={{
            initial: 'center',
          }}
        >
          <Typography variant="sigma" padding={20} margin={30} textColor="warning600">
            Nothing Found!
          </Typography>
        </Flex>
      ) : null}
      {posts.length > 0 ? (
        <Pagination activePage={currentPage} pageCount={pageCount}>
          <PreviousLink onClick={(e: FormEvent) => handlePageChange(e, currentPage - 1)}>
            Go to previous page
          </PreviousLink>
          {Array.from({ length: pageCount }, (_, index) => (
            <PageLink
              key={index}
              number={index + 1}
              onClick={(e: FormEvent) => handlePageChange(e, index + 1)}
            >
              Go to page {index + 1}
            </PageLink>
          ))}
          <NextLink onClick={(e: FormEvent) => handlePageChange(e, currentPage + 1)}>
            Go to next page
          </NextLink>
        </Pagination>
      ) : null}
    </Box>
  );
};

export default PublishingTable;
